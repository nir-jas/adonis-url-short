"use strict";

const Url = use('App/Models/Url')
const User = use('App/Models/User')

const Logger = use("Logger");

class DashboardController {
	async index({ view, auth }) {
		try {
			let data,stats;
			let user = await auth.user;
			let roles = await auth.user.getRoles()
			if (roles.includes('administrator')) {
				stats = {
					capacity 	: await Url.urlKeyCapacity(),
					remaining 	: await Url.urlKeyRemaining(),
					url_shortened : await Url.getCount(),
					url_clicks : await Url.getClicks(),
					users_registered: await User.getCount(),
					users_guest: await User.totalGuests()
				}
			} else {
				stats = {
					url_shortened : await Url.query().where('user_id',user.id).getCount(),
					url_clicks : await Url.getClicks(user.id)
				}
			}

			data = {
				stats : stats
			}

			return view.render("dashboard.index",{ data : data });
		} catch (error) {
			Logger.error("Dashborad View Error \n", error);
		}
	}
}

module.exports = DashboardController;
