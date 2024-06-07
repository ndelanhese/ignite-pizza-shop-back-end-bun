import jwt from "@elysiajs/jwt";
import { env } from "@env";
import { UnauthorizedError } from "@errors/unauthorized-error";
import Elysia, { t, type Static } from "elysia";

const jwtPayload = t.Object({
	sub: t.String(),
	restaurantId: t.Optional(t.String()),
});

export const auth = new Elysia()
	.error({ UNAUTHORIZED: UnauthorizedError })
	.onError(({ set, error, code }) => {
		if (code === "UNAUTHORIZED") {
			set.status = 401;
			return { code, message: error.message };
		}
	})
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

			console.log(token);

			auth.set({
				httpOnly: true,
				maxAge: SEVEN_DAYS_IN_SECONDS,
				path: "/",
				value: token,
			});
		},

		signOut: async () => {
			auth.remove();
		},

		getCurrentUser: async () => {
			const authCookie = auth;

			const payload = await jwt.verify(authCookie.value);

			if (!payload) {
				throw new UnauthorizedError();
			}

			return {
				userId: payload.sub,
				restaurantId: payload.restaurantId,
			};
		},
	}));
