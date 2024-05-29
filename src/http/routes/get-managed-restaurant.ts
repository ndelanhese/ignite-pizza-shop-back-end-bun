import { db } from "@db/connection";
import { auth } from "@http/auth";
import Elysia from "elysia";

export const getManagedRestaurant = new Elysia()
	.use(auth)
	.get("/managed-restaurant", async ({ getCurrentUser }) => {
		const { restaurantId } = await getCurrentUser();

		if (!restaurantId) {
			throw new Error("User is not a manager.");
		}

		const managedRestaurant = await db.query.restaurants.findFirst({
			where(fields, { eq }) {
				return eq(fields.id, restaurantId);
			},
		});

		if (!managedRestaurant) {
			throw new Error("Restaurant nof found.");
		}

		return managedRestaurant;
	});
