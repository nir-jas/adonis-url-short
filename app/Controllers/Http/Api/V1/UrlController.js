"use strict";
const Url = use('App/Models/Url')
const UrlStat = use('App/Models/UrlStat')
class UrlController {
	async customLinkAvailabilityCheck({ response }) {
		response.jsend({ success: "Available" }, "Successfully Requested");
		return;
	}

	async getUrls({ request, response, auth }){
		const user = await auth.user;
		const roles = await user.getRoles();
		let urls = Url.query()
		if (!roles.includes('administrator')) urls = urls.where('user_id', user.id)
		urls = await urls.with('user').orderBy('created_at','desc').paginate(request.input('page', 1),request.input('limit',5))

		response.jsend(urls,"Successfully Requested")
		return
	}

	async getMyUrls({ request, response, auth }){
		const user = await auth.user;
		let urls = await Url.query()
			.where('user_id', user.id)
			.orderBy('created_at','desc')
			.paginate(request.input('page', 1),request.input('limit',5))

		response.jsend(urls,"Successfully Requested")
		return
	}

	async deleteUrl({ request, response, params }){
		let url = await Url.find(params.id);
		if (!url) {
			response.jsend(null,"URL Not Found",404)
			return
		}

		await UrlStat.query().where('url_id', params.id).delete()
		await url.delete()

		response.jsend(null,"Successfully Deleted",204)
		return
	}
}

module.exports = UrlController;
