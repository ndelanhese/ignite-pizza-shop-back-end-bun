import jwt from "@elysiajs/jwt";
import { env } from "@env";
import Elysia, { t } from "elysia";

export const auth = new Elysia().use(
	jwt({
		secret: env.JWT_SECRET_KEY,
		schema: t.Object({
			sub: t.String(),
			restaurantId: t.Optional(t.String()),
		}),
	}),
);
