"use strict";
const User = use("App/Models/User");
const Hash = use("Hash");

class UserController {
	async getUsers({ request, response }) {
		let params = request.all();
		let users = User.query().with("roles");

		if (params.sort && params.sort == "name") users = users.orderBy("name", params.order);
		else if (params.sort && params.sort == "email") users = users.orderBy("email", params.order);
		else if (params.sort && params.sort == "created_at") users = users.orderBy("created_at", params.order);
		else if (params.sort && params.sort == "updated_at") users = users.orderBy("updated_at", params.order);
		else users = users.orderBy("created_at", "DESC");

		if (params.search && params.search != "") {
			users = users
				.where("name", "like", "%" + params.search + "%")
				.orWhere("email", "like", "%" + params.search + "%");
		}

		users = await users.paginate(request.input("page", 1), request.input("limit", 10));
		response.jsend(users, "Successfully Requested");
		return;
	}

	async changePassword({ request, view, response, auth }) {
		let params = request.all();
			if (!params.current_password || params.current_password == "") {
				response.jsend(null, "current_password required", 422);
				return;
			}

			if (!params.new_password || params.new_password == "") {
				response.jsend(null, "new_password required", 422);
				return;
			}

			if (!params.confirm_password || params.confirm_password == "") {
				response.jsend(null, "confirm_password required", 422);
				return;
			}

			let user = await User.query()
				.where("id", params.user_id)
				.first();

			let verifyPassword = await Hash.verify(params.current_password, user.password);

			if (!verifyPassword) {
				response.jsend(null, "invalid current_password", 422);
				return;
			}

			if (params.new_password != params.confirm_password) {
				response.jsend(null, "password not matched", 422);
				return;
			}

			await User.query()
				.where("id", params.user_id)
				.update({ password: await Hash.make(params.new_password) });

			response.jsend({ user }, "Successfully Requested");
			return;
	}
}

module.exports = UserController;
