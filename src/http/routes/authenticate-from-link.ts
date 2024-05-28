import { db } from "@db/connection";
import { authLinks } from "@db/schema";
import { auth } from "@http/auth";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";

export const authenticateFromLink = new Elysia().use(auth).get(
	"/auth-links/authenticate",
	async ({ query, set, signUser }) => {
		const { code, redirect } = query;

		const authLinkFromCode = await db.query.authLinks.findFirst({
			where(fields, { eq }) {
				return eq(fields.code, code);
			},
		});

		if (!authLinkFromCode) {
			throw new Error("Auth link not found.");
		}

		const daySinceAuthLinkWasCreated = dayjs().diff(
			authLinkFromCode.createdAt,
			"days",
		);

		const ONE_WEEK_IN_DAYS = 7;

		if (daySinceAuthLinkWasCreated > ONE_WEEK_IN_DAYS) {
			throw new Error("Auth link expired, please generate a new one.");
		}

		const managerRestaurant = await db.query.restaurants.findFirst({
			where(fields, { eq }) {
				return eq(fields.managerId, authLinkFromCode.userId);
			},
		});

		await signUser({
			sub: authLinkFromCode.userId,
			restaurantId: managerRestaurant?.id,
		});

		await db.delete(authLinks).where(eq(authLinks.code, code));

		set.redirect = redirect;
	},
	{
		query: t.Object({
			code: t.String(),
			redirect: t.String({ format: "uri" }),
		}),
	},
);
