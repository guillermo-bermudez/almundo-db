'use strict'

const Sequelize = require('sequelize')
const setupDB = require('../lib/db')

module.exports = function setupHotelModel (config) {
  const sequelize = setupDB(config)

  return sequelize.define('hotels', {
    id: {
      primaryKey: true,
      type: Sequelize.BIGINT,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    stars: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amenities: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })
}
