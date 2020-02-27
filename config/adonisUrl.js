'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
	/**
	 * Number of symbols in generating unique url_key.
	 * If hash_size_1 == hash_size_2, hash_size_2 is automatically declared to be of no value.
	 */
	hash_size_1 : Env.get('HASH_SIZE_1',6),
	hash_size_2 : Env.get('HASH_SIZE_2',7),

	/**
	 * Symbols to be used in generating unique url_key.
	 */
	hash_alphabet : Env.get('HASH_ALPHABET','0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),

	/**
	 * A list of non allowed domain.
	 */
	blacklist: [
		Env.get('APP_URL'),
		// 'bit.ly',
        // 'adf.ly',
        // 'goo.gl',
        // 't.co',
	]
}
