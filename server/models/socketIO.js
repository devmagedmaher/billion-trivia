

class SocketIO {

  /**
   * IO
   * 
   */
  __io

  /**
   * Socket
   * 
   */
  __socket

  /**
   * room name
   * 
   * @type {String}
   */
  __room


  /**
   * init
   * 
   */
  constructor({ io, room, socket }) {
    this.__io = io
    this.__socket = socket
    this.__room = room
  }

  /**
   * join socket room
   * 
   */
  joinRoom() {
    this.__socket.join(this.__room)
  }

  /**
   * leave socket room
   */
  leaveRoom() {
    this.__socket.leave(this.__room)
  }

  /**
   * send refreshed data
   * 
   * @param {Object} data any data to be sent in object
   */
  refresh(data) {
    // console.log('REFRESH', data)
    // emit updated room data to room players
    this.__io.to(this.__room).emit('refresh', data)
  }

  /**
   * send message to socket only
   * 
   * @param {String} text text message
   * @param {String} type success|error|warning|info|null
   */
  selfMessage(text, type) {
    // emeit message to this socket
    this.__socket.emit('message', { text, type })
  }

  /**
   * send message to room except this socket
   * 
   * @param {String} text text message
   * @param {String} type success|error|warning|info|null
   */
  castMessage(text, type) {
    // emeit message to room except this socket
    this.__socket.broadcast.to(this.__room).emit('message', { text, type })
  }

  /**
   * send message to room include this socket
   * 
   * @param {String} text text message
   * @param {String} type success|error|warning|info|null
   */
  roomMessage(text, type) {
    // emeit message to room
    this.__io.to(this.__room).emit('message', { text, type })
  }
}

module.exports = SocketIO