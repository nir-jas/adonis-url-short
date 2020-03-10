"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Config = use("Config");
const nanoid = require('nanoid/async/generate')
const Metascraper = require('scrape-meta')

class Url extends Model {

	static boot () {
		super.boot()

		this.addHook('beforeCreate', async (urlInstance) => {
			const metadata = await Metascraper.scrapeUrl(urlInstance.long_url);
			urlInstance.meta_title = metadata.title
		})
	}

	/**
	 * Url has many UrlStat
	 */
	urlStat() {
		return this.hasMany('App/Models/UrlStat')
	}


	/**
	 * Url belongs to User
	 */
	user(){
		return this.belongsTo('App/Models/User')
	}

	static async getClicks(user_id=null) {
		let clicks = this.query();
		if (user_id) clicks = clicks.where('user_id', user_id)
		clicks = await clicks.sum('clicks as total');

		if(clicks && clicks[0].total)
			return clicks[0].total
		else
			return 0
	}

	static async generateKey() {
		let alphabet = Config.get('adonisUrl.hash_alphabet');
		let size1 = Config.get('adonisUrl.hash_size_1');
		let size2 = Config.get('adonisUrl.hash_size_2');

		if ((size1 == size2) || size2 == 0) {
            size2 = size1;
		}

		let urlKey = await nanoid(alphabet, size1);
		let link = await this.query().where('url_key',urlKey).first()

		while (link) {
			urlKey = await nanoid(alphabet, size2);
			link = await this.query().where(url_key,urlKey).first()
		}

		return urlKey
	}

	static urlKeyCapacity() {
		const alphabet = Config.get("adonisUrl.hash_alphabet").length;
		let size1 = Config.get("adonisUrl.hash_size_1");
		let size2 = Config.get("adonisUrl.hash_size_2");

		// If the hash size is filled with integers that do not match the rules change the variable's value to 0.
		size1 = !(size1 < 1) ? size1 : 0;
		size2 = !(size2 < 0) ? size2 : 0;

		if (size1 == 0 || (size1 == 0 && size2 == 0)) {
			return 0;
		} else if (size1 == size2 || size2 == 0) {
			return Math.pow(alphabet, size1);
		} else {
			return Math.pow(alphabet, size1) + Math.pow(alphabet, size2);
		}
	}

	static async urlKeyRemaining() {
		const totalShortUrl = await this.query()
			.where("is_custom", false)
			.getCount();
		const urlKeyCapacity = this.urlKeyCapacity();

		if (urlKeyCapacity < totalShortUrl) return 0;

		return urlKeyCapacity - totalShortUrl;
	}
}

module.exports = Url;
