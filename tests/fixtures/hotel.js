'use strict'

const hotel = {
  id: 1,
  name: 'hotel',
  stars: 5,
  price: 123.4567,
  image: 'image.png',
  amenities: ['test']
}

const hotels = [
  hotel,
  extend(hotel, { id: 2, name: 'another hotel', stars: 0, price: 765.4321, image: 'another-image.png', amenities: ['test2', 'test3'] }),
  extend(hotel, { id: 3, name: 'my hotel', stars: 3, price: 9999.9999, image: 'my-image.png', amenities: ['test4', 'test5', ''] })
]

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

module.exports = {
  single: hotel,
  all: hotels,
  h: hotels.filter(a => a.name === 'hotel'),
  containsByName: name => hotels.filter(f => f.name.includes(name)),
  findByName: name => hotels.filter(f => f.name === name),
  findById: id => hotels.filter(f => f.id === id).shift()
}
