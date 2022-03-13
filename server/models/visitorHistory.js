const Model = require('objection').Model
const _ = require('lodash')

/* global WIKI */

/**
 * VisitorHistory model
 */
module.exports = class VisitorHistory extends Model {
  static get tableName() { return 'visitorHistory' }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['historyId', 'visitorId'],

      properties: {
        id: {type: 'integer'},
        historyId: {type: 'integer'},
        pageId: {type: 'integer'},
        visitorId: {type: 'integer'},

        visitedAt: {type: 'string'},
      }
    }
  }

  static get relationMappings() {
    return {
      page: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./pageHistory'),
        join: {
          from: 'visitors.historyId',
          to: 'pageHistory.id'
        }
      },
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

  $beforeUpdate() {
    this.visitedAt = new Date().toISOString()
  }
  $beforeInsert() {
    this.visitedAt = new Date().toISOString()
  }
}
