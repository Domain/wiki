exports.up = async knex => {
  const dbCompat = {
    charset: (WIKI.config.db.type === `mysql` || WIKI.config.db.type === `mariadb`)
  }
  return knex.schema
    .createTable('visitors', table => {
      if (dbCompat.charset) { table.charset('utf8mb4') }
      table.increments('id').primary()
      table.integer('historyId').unsigned().defaultTo(0)
      table.integer('visitorId').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('pageId').unsigned().references('id').inTable('pages')
      table.string('firstVisitedAt').notNullable()
      table.string('lastVisitedAt').notNullable()
      table.integer('totalTime').unsigned().defaultTo(0)
    })
    .alterTable('users', table => {
      table.string('timezone').notNullable().defaultTo('Asia/Shanghai').alter()
    })
}

exports.down = knex => { }
