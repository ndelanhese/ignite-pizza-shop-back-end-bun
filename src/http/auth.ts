import jwt from "@elysiajs/jwt";
import { env } from "@env";
import Elysia, { t, type Static } from "elysia";

const jwtPayload = t.Object({
	sub: t.String(),
	restaurantId: t.Optional(t.String()),
});

export const auth = new Elysia()
	.use(
		jwt({
			secret: env.JWT_SECRET_KEY,
			schema: jwtPayload,
		}),
	)
	.derive({ as: "global" }, ({ cookie: { auth }, jwt }) => ({
		signUser: async (payload: Static<typeof jwtPayload>) => {
			const token = await jwt.sign(payload);

			const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;

			auth.set({
				httpOnly: true,
				maxAge: SEVEN_DAYS_IN_SECONDS,
				path: "/",
				value: token,
			});
		},
	}));
