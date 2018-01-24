'use strict'

const setupDB = require('./lib/db')
const setupHotelModel = require('./models/hotel')
const setupHotel = require('./lib/hotel')
const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      min: 0,
      max: 10,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDB(config)
  const HotelModel = setupHotelModel(config)

  await sequelize.authenticate()

  if (config.setup) { await sequelize.sync({ force: true }) }

  const Hotel = setupHotel(HotelModel)

  return {
    Hotel
  }
}
