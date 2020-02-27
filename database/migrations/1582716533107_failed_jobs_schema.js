'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FailedJobsSchema extends Schema {
  up () {
    this.create('failed_jobs', (table) => {
      table.increments()
      table.text('connection')
      table.text('queue')
      table.text('payload','longtext')
      table.text('exception','longtext')
      table.timestamps()
    })
  }

  down () {
    this.drop('failed_jobs')
  }
}

module.exports = FailedJobsSchema
