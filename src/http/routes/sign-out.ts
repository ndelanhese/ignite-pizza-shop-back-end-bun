import { auth } from "@http/auth";
import Elysia from "elysia";

export const signOut = new Elysia()
	.use(auth)
	.post("sign-out", async ({ cookie: { auth } }) => {
		auth.remove();
	});
