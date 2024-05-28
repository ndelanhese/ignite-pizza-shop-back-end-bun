import { env } from "@env";
import chalk from "chalk";
import { Elysia } from "elysia";
import { registerRestaurant } from "./routes/register-restaurant";
import { sendAuthLink } from "./routes/send-auth-link";

const app = new Elysia().use(registerRestaurant).use(sendAuthLink);

app.listen(env.API_PORT, () => {
	console.log(chalk.green("🚀 HTTP server running!"));
});
