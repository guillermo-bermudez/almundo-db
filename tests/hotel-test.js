'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const hotelFixtures = require('./fixtures/hotel')

let config = {
  logging: function () {}
}

let single = Object.assign({}, hotelFixtures.single)
let id = 1
let idArgs = {
  where: { id: 1 }
}
let nameArgs = {
  where: { name: 'hotel' }
}
let newHotel = {
  name: 'new Hotel',
  stars: 5,
  price: '555.5555',
  image: 'new-image.png',
  amenities: ['new']
}

let HotelStub = null
let db = null
let sandbox = null

test.beforeEach(async () => {
  sandbox = sinon.sandbox.create()

  HotelStub = {}

    // Model create Stub
  HotelStub.create = sandbox.stub()
  HotelStub.create.withArgs(newHotel).returns(Promise.resolve({ toJSON () { return newHotel } }))

    // Model update Stub
  HotelStub.update = sandbox.stub()
  HotelStub.update.withArgs(single, idArgs).returns(Promise.resolve(single))

    // Model findOne Stub
  HotelStub.findOne = sandbox.stub()
  HotelStub.findOne.withArgs(idArgs).returns(Promise.resolve(hotelFixtures.findById(id)))

    // Model findById Stub
  HotelStub.findById = sandbox.stub()
  HotelStub.findById.withArgs(id).returns(Promise.resolve(hotelFixtures.findById(id)))

    // Model findAll Stub
  HotelStub.findAll = sandbox.stub()
  HotelStub.findAll.withArgs().returns(Promise.resolve(hotelFixtures.all))
  HotelStub.findAll.withArgs(nameArgs).returns(Promise.resolve(hotelFixtures.h))

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

test.serial('Hotel#findById', async t => {
  let hotel = await db.Hotel.findById(id)

  t.true(HotelStub.findById.called, 'findById should be called on model')
  t.true(HotelStub.findById.calledOnce, 'findById should be called once')
  t.true(HotelStub.findById.calledWith(id), 'findById should be called with specified id')

  t.deepEqual(hotel, hotelFixtures.findById(id), 'should be the same')
})

test.serial('Hotel#createOrUpdate - exists', async t => {
  let hotel = await db.Hotel.createOrUpdate(single)

  t.true(HotelStub.findOne.called, 'findOne should be called on model')
  t.true(HotelStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(HotelStub.update.calledOnce, 'update should be called once')

  t.deepEqual(hotel, single, 'hotel should be the same')
})

test.serial('Hotel#createOrUpdate - new', async t => {
  let hotel = await db.Hotel.createOrUpdate(newHotel)

  t.true(HotelStub.findOne.called, 'findOne should be called on model')
  t.true(HotelStub.findOne.calledOnce, 'findOne should be called once')
  t.true(HotelStub.findOne.calledWith({
    where: { id: newHotel.id }
  }), 'findOne should be called with id args')
  t.true(HotelStub.create.called, 'create should be called on model')
  t.true(HotelStub.create.calledOnce, 'create should be called once')
  t.true(HotelStub.create.calledWith(newHotel), 'create should be called with model')

  t.deepEqual(hotel, newHotel, 'hotel should be the same')
})

test.serial('Hotel#findAll', async t => {
  let hotels = await db.Hotel.findAll()

  t.true(HotelStub.findAll.called, 'findAll should be called on model')
  t.true(HotelStub.findAll.calledOnce, 'findAll should be called once')
  t.true(HotelStub.findAll.calledWith(), 'findAll should be called without Args')

  t.is(hotels.length, hotelFixtures.all.length, 'hotels should be the same')
  t.deepEqual(hotels, hotelFixtures.all, 'hotels should be the same')
})

// test.serial('Setup', t => {
//     t.true(HotelStub, 'Hotel was executed')
// })
