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
      required: ['visitorId'],

      properties: {
        id: {type: 'integer'},
        pageId: {type: 'integer'},
        visitorId: {type: 'integer'},
        visitedAt: {type: 'string'},
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

  $beforeUpdate() {
    this.visitedAt = new Date().toISOString()
  }
  $beforeInsert() {
    this.visitedAt = new Date().toISOString()
  }
}
