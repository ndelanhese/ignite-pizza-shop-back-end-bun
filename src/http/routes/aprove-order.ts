import { db } from "@db/connection";
import { orders } from "@db/schema";
import { auth } from "@http/auth";
import { UnauthorizedError } from "@http/errors/unauthorized-error";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";

export const aproveOrder = new Elysia().use(auth).patch(
	"/orders/:orderId/approve",
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

		if (order.status !== "pending") {
			set.status = 400;

			return { message: "You can only approve pending orders." };
		}

		await db
			.update(orders)
			.set({ status: "processing" })
			.where(eq(orders.id, orderId));
	},
	{
		params: t.Object({
			orderId: t.String(),
		}),
	},
);
