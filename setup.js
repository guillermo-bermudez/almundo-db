'use strict'

const debug = require('debug')('api_rest:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')

const propmt = inquirer.createPromptModule()

async function setup () {
  const answer = await propmt([{
      type: 'confirm',
      name: 'setup',
      message: 'This will overwrite your database, are you sure?',
  }])

  if (!answer.setup) { return console.log('Nothing happened!') }
  
  const config = {
    database: process.env.DB_NAME || 'almundo',
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'almundo123',
    host: process.env.BD_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }
  await db(config).catch(handleFatalError)
  console.log('Success!')
  process.exit(0)
}

function handleFatalError (error) {
  console.error(`${chalk.red('[fatal error]:')} ${error.message}`)
  console.error(error.stack)
  process.exit(1)
}

setup()
