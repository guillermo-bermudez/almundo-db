'use strict'

const debug = require('debug')('api_db:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')

const db = require('./')

const propmt = inquirer.createPromptModule()

async function setup () {
  const args = process.argv[2]
  const flagSetup = !!((args === '-y' || args === '--yes'))
  let flagAnswer = false

  if (!flagSetup) {
    const answer = await propmt([{
      type: 'confirm',
      name: 'setup',
      message: 'This will overwrite your database, are you sure?'
    }])

    flagAnswer = answer.setup
  }

  if (!flagSetup && !flagAnswer) { return console.log('Nothing happened!') }

  const config = {                                                          //  localhost setup
    database: process.env.DB_NAME || 'almundo',                             //  almundo
    username: process.env.DB_USER || 'admin@calipso',                       //  admin
    password: process.env.DB_PASS || 'almundo123$',                         //  almundo123
    host: process.env.BD_HOST || 'calipso.postgres.database.azure.com',     //  localhost
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: true
    },
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)
  console.log('\nSuccess!!! :)')
  process.exit(0)
}

function handleFatalError (error) {
  console.error(`${chalk.red('[fatal error]:')} ${error.message}`)
  console.error(error.stack)
  process.exit(1)
}

setup()
