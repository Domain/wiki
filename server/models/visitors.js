const Model = require('objection').Model
const _ = require('lodash')

/* global WIKI */

/**
 * Visitors model
 */
module.exports = class Visitors extends Model {
  static get tableName() { return 'visitors' }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['pageId', 'visitorId'],

      properties: {
        id: {type: 'integer'},
        pageId: {type: 'integer'},
        historyId: {type: 'integer'},
        visitorId: {type: 'integer'},
        firstVisitedAt: {type: 'string'},
        lastVisitedAt: {type: 'string'},
        totalTime: {type: 'integer'}
      }
    }
  }

  static get relationMappings() {
    return {
      page: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./pages'),
        join: {
          from: 'visitors.pageId',
          to: 'pages.id'
        }
      },
      visitor: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./users'),
        join: {
          from: 'visitors.visitorId',
          to: 'users.id'
        }
      }
    }
  }

  static get modifiers() {
    return {
      noHistory(builder) {
        builder.where('historyId', '0');
      },

      orderByVisit(builder) {
        builder.orderBy('totalTime');
      }
    };
  }

  $beforeInsert() {
    const now = new Date().toISOString()
    this.firstVisitedAt = now
    this.lastVisitedAt = now
  }

  $beforeUpdate() {
    this.lastVisitedAt = new Date().toISOString()
  }

  static async newVisitor(page, visitorId) {
    await WIKI.models.visitors.query().insert({
      pageId: page.id,
      visitorId: visitorId
    })
  }

  static async update(history, page, visitorId) {
    await WIKI.models.visitors.query().patch({
      historyId: history.id
    }).where({
      pageId: page.id,
      historyId: 0
    })

    await WIKI.models.visitors.newVisitor(page, visitorId)
  }

  static async updateTime(visitorId, pageId, duration) {
    await WIKI.models.visitors.query().increment('totalTime', duration).where({
      visitorId: visitorId,
      pageId: pageId,
      historyId: 0
    })
  }
}
