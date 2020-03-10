"use strict";
const Logger = use("Logger");
const User = use("App/Models/User");
const Role = use("Adonis/Acl/Role");

class AuthController {
	async register({ request, response, auth, session }) {
		let params = request.all();
		try {
			const user = await User.create({
				name: params.name,
				email: params.email,
				password: params.password
			});

			const roleUser = await Role.findBy("slug", "user");

			await user.roles().attach([roleUser.id]);

			await auth.remember(true).attempt(params.email, params.password);

			response.route("home");
			return;
		} catch (error) {
			Logger.error("Signup Error:\n", error);

			session.flash({
				error: "Something went wrong"
			});
			response.redirect("back");
			return;
		}
	}

	async login({ request, response, auth, session }) {
		let params = request.all();
		try {
			await auth.remember(params.remember ? true : false).attempt(params.email, params.password);

			response.route("dashboard");
			return;
		} catch (error) {
			Logger.error("User login error ", error);
			let message = "Sorry, our service is currently under maintenance.";
			if (error.code == "E_PASSWORD_MISMATCH" || error.code == "E_USER_NOT_FOUND") {
				message = "Email or Password Invalid";
			}

			session.flashOnly(["email"]);
			session.flash({ error: message });
			response.redirect("back");
			return;
		}
	}

	async logout({ response, auth }) {
		await auth.logout();
		response.route("login");
		return;
	}
}

module.exports = AuthController;
