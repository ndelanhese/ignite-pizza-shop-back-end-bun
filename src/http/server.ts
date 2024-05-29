import { env } from "@env";
import chalk from "chalk";
import { Elysia } from "elysia";
import { authenticateFromLink } from "./routes/authenticate-from-link";
import { getManagedRestaurant } from "./routes/get-managed-restaurant";
import { getProfile } from "./routes/get-profile";
import { registerRestaurant } from "./routes/register-restaurant";
import { sendAuthLink } from "./routes/send-auth-link";
import { signOut } from "./routes/sign-out";

const app = new Elysia()
	.use(registerRestaurant)
	.use(sendAuthLink)
	.use(authenticateFromLink)
	.use(signOut)
	.use(getProfile)
	.use(getManagedRestaurant)
	.onError(({ code, error, set }) => {
		if (code === "VALIDATION") {
			set.status = error.status;
			return error.toResponse();
		}

		set.status = 500;
		return;
	});

app.listen(env.API_PORT, () => {
	console.log(chalk.green("🚀 HTTP server running!"));
});
