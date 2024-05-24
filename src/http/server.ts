import { env } from "@env";
import chalk from "chalk";
import { Elysia } from "elysia";

const app = new Elysia().get("/", () => {
	return "Hello World";
});

app.listen(env.API_PORT, () => {
	console.log(chalk.green("🚀 HTTP server running!"));
});
