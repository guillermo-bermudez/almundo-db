'use strict'

module.exports = function setupHotel (HotelModel) {
  async function createOrUpdate (hotel) {
    const condition = {
      where: {
        id: hotel.id
      }
    }

    const existingHotel = await HotelModel.findOne(condition)

    if (existingHotel) {
      const updated = await HotelModel.update(hotel, condition)
      return updated ? HotelModel.findOne(condition) : existingHotel
    }

    const result = await HotelModel.create(hotel)
    return result.toJSON()
  }

  function findById (id) {
    return HotelModel.findById(id)
  }

  function findAll () {
    return HotelModel.findAll()
  }

  function findByName (name) {
    return HotelModel.findAll({
      where: {
        name
      }
    })
  }

  function containsByName (name) {
    return HotelModel.findAll({
      where: {
        name: {
          $iLike: `%` + name + `%`
        }
      }
    })
  }

  function findByStars (stars) {
    return HotelModel.findAll({
      where: {
        stars: {
          $in: [ stars ]
        }
      }
    })
  }

  function findByPrice (range) {
    return HotelModel.findAll({
      where: {
        price: {
          $between: [ range ]
        }
      }
    })
  }

  return {
    createOrUpdate,
    findById,
    findAll,
    findByName,
    containsByName,
    findByStars,
    findByPrice
  }
}
