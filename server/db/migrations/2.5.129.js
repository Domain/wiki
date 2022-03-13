exports.up = async knex => {
  const dbCompat = {
    charset: (WIKI.config.db.type === `mysql` || WIKI.config.db.type === `mariadb`)
  }
  return knex.schema
    .createTable('visitors', table => {
      if (dbCompat.charset) { table.charset('utf8mb4') }
      table.increments('id').primary()
      table.integer('visitorId').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('pageId').unsigned().references('id').inTable('pages').onDelete('CASCADE')
      table.string('visitedAt').notNullable()
    })
    .createTable('visitorHistory', table => {
      if (dbCompat.charset) { table.charset('utf8mb4') }
      table.increments('id').primary()
      table.integer('historyId').unsigned().references('id').inTable('pageHistory').onDelete('CASCADE')
      table.integer('visitorId').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('pageId').unsigned().references('id').inTable('pages').onDelete('CASCADE')
      table.string('visitedAt').notNullable()
    })
}

exports.down = knex => { }
