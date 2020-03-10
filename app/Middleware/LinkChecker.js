'use strict'
const Url = use('App/Models/Url')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class LinkChecker {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, session, auth }, next) {
	const longUrl = request.input('long_url').trim().replace(/\/+$/,'')
	let shortUrl;

	if (await Url.urlKeyRemaining() == 0) {
		session.flash({
			'error':'Sorry, our service is currently under maintenance.'
		})
		response.redirect('back')
		return
	}

	try {
		shortUrl = await Url.query()
			.where('user_id',await auth.user.id)
			.where('long_url',longUrl)
			.first()
	} catch (error) {
		shortUrl = await Url.query()
			.whereNull('user_id')
			.where('long_url',longUrl)
			.first()
	}

	if (shortUrl) {
		session.flash({
			'link_already_exists':'Link already exists'
		})
		response.route('short_url.stats',{"url_key":shortUrl.url_key})
		return
	}

    await next()
  }
}

module.exports = LinkChecker
