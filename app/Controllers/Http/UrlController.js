"use strict";
const Url = use("App/Models/Url")
const UrlStat = use("App/Models/UrlStat")

const Helpers = use('Helpers')
const Logger = use('Logger')
const QRcode = require('qrcode')
const UserAgent = require('ua-parser-js')
const Reader = require('@maxmind/geoip2-node').Reader;

class UrlController {
	async view({ request, view, response, auth, params }) {
		try {
			const url = await Url.query()
				.where('url_key', params.url_key)
				.first()

			const qrCode = await QRcode.toDataURL(url.long_url,{
				errorCorrectionLevel: 'H',
				scale:4,
				margin:0
			});
			let stats = [];

			if (url.clicks>0) {
				const browserStats = await UrlStat.query()
					.select('browser as name')
					.where('url_id', url.id)
					.groupBy('browser')
					.count("* as clicks");

				const platformStats = await UrlStat.query()
					.select('platform as name')
					.where('url_id', url.id)
					.groupBy('platform')
					.count("* as clicks");

				const countryStats = await UrlStat.query()
					.select('country as name')
					.where('url_id', url.id)
					.groupBy('country')
					.count("* as clicks");

					stats = [
						{
							title: 'Browsers',
							stats: browserStats
						},
						{
							title: 'Platforms',
							stats: platformStats
						},
						{
							title: 'Countries',
							stats: countryStats
						}
					]
			}


			return view.render('stats.index',{qr_code:qrCode,url:url,stats:stats})
		} catch (error) {
			Logger.error("View Stats Error", error)
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

	async redirect({ request, view, response, auth, params }){
		try {
			const url = await Url.findBy('url_key',params.url_key)

			if (!url) {
				response.route('error', { status: '404' })
				return
			}

			url.merge({clicks:url.clicks+1})
			await url.save()

			const agent = UserAgent(request.header('user-agent'))
			const country = await this.getCountryByIp(request.ip())

			await UrlStat.create({
				'url_id'           : url.id,
				'referer'          : request.header('referer')?request.header('referer'):null,
				'ip'               : request.ip(),
				'device'           : agent.device.vendor?agent.device.vendor:'Other',
				'platform'         : agent.os.name,
				'platform_version' : agent.os.version,
				'browser'          : agent.browser.name,
				'browser_version'  : agent.browser.version,
				'country'          : country.country_code,
				'country_full'     : country.country_name
			})

			response.redirect(url.long_url,false,301);
			return
		} catch (error) {
			Logger.error("URL Redirection Failed",error)

		}
	}

	async getCountryByIp(ip) {
		try {
			const reader = await Reader.open(Helpers.databasePath('GeoLite2-Country.mmdb'))
			const country = await reader.country(ip);

			return {
				country_code:country.country.isoCode,
				country_name:country.country.names.en
			}
		} catch (error) {
			return {
				country_code:'N/A',
				country_name:'Unknown'
			}
		}

	}
}

module.exports = UrlController;
