"use strict";
const User=use('App/Models/User')
const Logger = use('Logger')

class UserController {
	async getUsers({ request,response}) {
		let params=request.all();
		try {
			const page=request.input('page',1);
			let limit=10;
			let users=User.query().with('roles')
			users = users.orderBy('created_at','DESC')
			users = await users.paginate(page, limit);
			response.jsend({ users: users }, "Successfully Requested");
			return;

		} catch (error) {
			Logger.error("Something went wrong", error);
			return;
		}
	}
}

module.exports = UserController;
