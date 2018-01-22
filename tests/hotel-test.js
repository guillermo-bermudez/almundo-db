'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

let config = {
    logging: function() {}
}

let HotelStub = null
let db = null
let sandbox = null

test.beforeEach(async () => {
    sandbox = sinon.sandbox.create()

    HotelStub = {}
    const setupDB = proxyquire('../', {
        './models/hotel': () => HotelStub
    })
    db = await setupDB(config)
})

test.afterEach(() => {
    sandbox && sinon.sandbox.restore()
})

test('Hotel', t => {
    t.truthy(db.Hotel, 'Hotel service should exist')
})

// test.serial('Setup', t => {
//     t.true(HotelStub.called, 'Hotel was executed')
// })