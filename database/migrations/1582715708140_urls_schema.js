'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UrlsSchema extends Schema {
  up () {
    this.create('urls', (table) => {
      table.increments()
      table.integer('user_id').unsigned().index().nullable()
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.string('url_key').collate('utf8mb4_bin').unique().notNullable()
      table.boolean('is_custom').defaultTo(false)
      table.text('long_url').notNullable()
      table.string('meta_title')
      table.integer('clicks').unsigned()
      table.string('ip')
      table.timestamps()
    })
  }

  down () {
    this.drop('urls')
  }
}

module.exports = UrlsSchema
