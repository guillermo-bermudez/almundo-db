'use strict'

const chalk = require('chalk')
const resourceH = require('./res/data/data.json')

const db = require('../')

async function run () {
  const config = {                                                          //  localhost setup
    database: process.env.DB_NAME || 'almundo',                             //  almundo
    username: process.env.DB_USER || 'admin@calipso',                               //  admin
    password: process.env.DB_PASS || 'almundo123$',                         //  almundo123
    host: process.env.BD_HOST || 'calipso.postgres.database.azure.com',     //  localhost
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: true
    }
  }

  const { Hotel } = await db(config).catch(handleFatalError)

  await Promise.all(resourceH.map(async (h) => {
    await Hotel.createOrUpdate({
      id: h.id,
      name: h.name,
      stars: h.stars,
      price: h.price,
      image: h.image,
      amenities: h.amenities
    })
  })).catch(handleFatalError)

  console.log(`${chalk.magenta('\n--hotels has been migrated--')}`)
  const hotels = await Hotel.findAll().catch(handleFatalError)
  console.log(hotels)
  console.log(`${chalk.blue('\n--hotels list--')}`)

  process.exit(0)
}

function handleFatalError (error) {
  console.error(`${chalk.red('[fatal error]:')} ${error.message}`)
  console.error(error.stack)
  process.exit(1)
}

run()
