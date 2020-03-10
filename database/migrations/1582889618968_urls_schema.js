"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UrlsSchema extends Schema {
	up() {
		this.table("urls", table => {
			table.integer('clicks').alter().defaultTo(0)
		});
	}

	down() {
		this.table("urls", table => {
			table.integer('clicks').alter().unsigned()
		});
	}
}

module.exports = UrlsSchema;
