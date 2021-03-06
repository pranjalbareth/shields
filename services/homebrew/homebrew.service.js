'use strict'

const Joi = require('@hapi/joi')
const { renderVersionBadge } = require('../version')
const { BaseJsonService } = require('..')

const schema = Joi.object({
  versions: Joi.object({
    stable: Joi.string().required(),
  }).required(),
}).required()

module.exports = class Homebrew extends BaseJsonService {
  static category = 'version'

  static route = { base: 'homebrew/v', pattern: ':formula' }

  static examples = [
    {
      title: 'homebrew',
      namedParams: { formula: 'cake' },
      staticPreview: renderVersionBadge({ version: 'v0.32.0' }),
    },
  ]

  static defaultBadgeData = { label: 'homebrew' }

  async fetch({ formula }) {
    return this._requestJson({
      schema,
      url: `https://formulae.brew.sh/api/formula/${formula}.json`,
    })
  }

  async handle({ formula }) {
    const data = await this.fetch({ formula })
    return renderVersionBadge({ version: data.versions.stable })
  }
}
