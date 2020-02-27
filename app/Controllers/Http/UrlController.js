"use strict";
const Url = use("App/Models/Url")
const Logger = use('Logger')
const qrcode = require('qrcode')

class UrlController {
	async view({ request, view, response, auth, params }) {
		try {
			const url = await Url.query()
				.where('url_key', params.url_key)
				.first()

			console.log(url)

			const qrCode = await qrcode.toDataURL(url.long_url);

			return view.render('stats.index',{qr_code:qrCode,url:url})
		} catch (error) {

		}
	}

	async create({ request, view, response, auth, session }) {
		try {
			const urlKey = request.input("custom_url_key") ? request.input("custom_url_key") : await Url.generateKey();

			await Url.create({
				'user_id'    : await auth.user ? auth.user.id : null,
				'long_url'   : request.input("long_url"),
				'meta_title' : request.input("long_url"),
				'url_key'    : urlKey,
				'is_custom'  : request.input("custom_url_key") ? 1 : 0,
				'ip'         : request.ip(),
			})

			console.log(urlKey)
			response.route('short_url.stats',{"url_key":urlKey})
			return
		} catch (error) {
			Logger.error("Short URL Creation Failed",error)
			session.flash({
				'error':'Sorry, our service is currently under maintenance.'
			})
			response.redirect('back')
			return
		}

	}
}

module.exports = UrlController;
