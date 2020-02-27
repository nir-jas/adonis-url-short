'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UrlStatsSchema extends Schema {
  up () {
    this.create('url_stats', (table) => {
      table.increments()
      table.integer('url_id').unsigned().index().nullable()
      table.foreign('url_id').references('id').on('urls').onDelete('cascade')
      table.string('referer',300).nullable()
      table.string('ip')
      table.string('device').nullable()
      table.string('platform').nullable()
      table.string('platform_version').nullable()
      table.string('browser').nullable()
      table.string('browser_version').nullable()
      table.string('country',10).nullable()
      table.string('country_full',50).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('url_stats')
  }
}

module.exports = UrlStatsSchema
