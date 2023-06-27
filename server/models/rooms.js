const Room = require('./room')


class Rooms {

  /**
   * Init rooms as empty array
   * 
   */
  constructor() {
    this.rooms = []
  }

  /**
   * Create new room
   * 
   * @param {String} name room name
   * @param {String} options room options
   * 
   * @return {Object} created room
   */
  create(name, options) {
    // return room if exists
    if (this.roomExists(name)) {
      return this.get(name)
    }
    // return new created room
    return this.addRoom(name, options)
  }

  /**
   * 
   * @param {String} name room name 
   * @returns {Room|NULL}
   */
  get(name) {
    return this.rooms.find(r => r.name === name)
  }

  /**
   * 
   * @param {String} name room name
   * @param {Object} name room options
   * 
   * @returns {Room} newly created room
   */
  addRoom(name, options) {
    const room = new Room(name, options)
    this.rooms.push(room)
    return room
  }

  /**
   * 
   * @param {String} name room name 
   * @returns {Boolean}
   */
  roomExists(name) {
    return this.rooms.some(r => r.name === name)
  }


}

module.exports = Rooms