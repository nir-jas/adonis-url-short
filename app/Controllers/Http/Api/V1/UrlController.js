"use strict";
const Url = use('App/Models/Url')
const UrlStat = use('App/Models/UrlStat')
const Logger = use('Logger')
class UrlController {
	async customLinkAvailabilityCheck({ response }) {
		response.jsend({ success: "Available" }, "Successfully Requested");
		return;
	}

	async getUrls({ request, response, auth }){
		try {
			const user = await auth.user;
			const roles = await user.getRoles();
			let urls = Url.query()
			if (!roles.includes('administrator')) urls = urls.where('user_id', user.id)
			urls = await urls.with('user').orderBy('created_at','desc').paginate(request.input('page', 1),request.input('limit',5))

			response.jsend(urls,"Successfully Requested")
			return
		} catch (error) {
			Logger.error("Get Urls Failed \n", error);
		}
	}

	async getMyUrls({ request, response, auth }){
		try {
			const user = await auth.user;
			let urls = await Url.query()
				.where('user_id', user.id)
				.orderBy('created_at','desc')
				.paginate(request.input('page', 1),request.input('limit',5))

			response.jsend(urls,"Successfully Requested")
			return
		} catch (error) {
			Logger.error("Get My Urls Failed \n", error);
		}
	}

	async deleteUrl({ request, response, params }){
		try {
			let url = await Url.find(params.id);
			await UrlStat.query().where('url_id', params.id).delete()
			await url.delete()

			response.jsend(null,"Successfully Deleted",204)
			return
		} catch (error) {
			Logger.error("Url Deletetion Error",error)
			reponse.jsend(null,"Something Went Wrong",500)
			return
		}
	}
}

module.exports = UrlController;
