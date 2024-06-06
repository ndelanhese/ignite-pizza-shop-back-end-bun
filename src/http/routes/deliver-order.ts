import { db } from "@db/connection";
import { orders } from "@db/schema";
import { auth } from "@http/auth";
import { UnauthorizedError } from "@http/errors/unauthorized-error";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";

export const deliverOrder = new Elysia().use(auth).patch(
	"/orders/:orderId/deliver",
	async ({ getCurrentUser, set, params }) => {
		const { orderId } = params;
		const { restaurantId } = await getCurrentUser();

		if (!restaurantId) {
			throw new UnauthorizedError();
		}

		const order = await db.query.orders.findFirst({
			where(fields, { eq }) {
				return eq(fields.id, orderId);
			},
		});

		if (!order) {
			set.status = 400;
			return { message: "Order not found." };
		}

		if (order.status !== "delivering") {
			set.status = 400;

			return {
				message:
					"You cannot deliver orders that are not in 'delivering' status.",
			};
		}

		await db
			.update(orders)
			.set({ status: "delivered" })
			.where(eq(orders.id, orderId));
	},
	{
		params: t.Object({
			orderId: t.String(),
		}),
	},
);
