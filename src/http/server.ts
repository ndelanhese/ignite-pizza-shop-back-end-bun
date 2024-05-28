import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import { env } from "@env";
import chalk from "chalk";
import { Elysia, t } from "elysia";
import { registerRestaurant } from "./routes/register-restaurant";
import { sendAuthLink } from "./routes/send-auth-link";

const app = new Elysia()
	.use(
		jwt({
			secret: env.JWT_SECRET_KEY,
			schema: t.Object({
				sub: t.String(),
				restaurantId: t.Optional(t.String()),
			}),
		}),
	)
	.use(cookie())
	.use(registerRestaurant)
	.use(sendAuthLink);

app.listen(env.API_PORT, () => {
	console.log(chalk.green("🚀 HTTP server running!"));
});
