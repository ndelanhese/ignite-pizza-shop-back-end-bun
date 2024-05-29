import { db } from "@db/connection";
import { auth } from "@http/auth";
import Elysia from "elysia";

export const getProfile = new Elysia()
	.use(auth)
	.get("/me", async ({ getCurrentUser }) => {
		const { userId } = await getCurrentUser();

		const user = await db.query.users.findFirst({
			where(fields, { eq }) {
				return eq(fields.id, userId);
			},
		});

		if (!user) {
			throw new Error("User not found.");
		}

		return user;
	});
