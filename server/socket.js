const Rooms = require('./models/rooms')
const Utils = require('./utils')

const rooms = new Rooms()

module.exports = io => {
  return async socket => {
    const { room, name, id } = socket.handshake.query;
    Utils.tryCatch(() => {
      console.log(`player: ${name} is joining room: ${room}`)

      // create/get room by name
      const r = rooms.create(room, { io })

      // check if there is a player connected with the same id
      if (r.getPlayer(id)?.isConnected) {
        console.error(`player: ${name} is already joined to room: ${room}`)
        sendMessage('self', 'You are already connected on different tab or window.', 'error')
        socket.disconnect()
        return
      }

      // join player to room
      const p = r.joinPlayer(id, name, { socket })


      /**
       * EnterGame: handle player enter game
       * 
       */
      function handleEnterGameEvent() {
        Utils.tryCatch(() => {
          console.log(`player: ${name} entered game in room: ${room}`)
          // enter player to the room's game
          r.enterPlayer(id)
        },
        e => {
          console.error('[ERROR][SOCKET]', e)
          sendMessage('self', 'Oops, something wrong occurred on the server.', 'error')
          socket.disconnect()
        })
      }

      /**
       * ChangeGame: handle change game event
       * 
       * @param {String} gameName game name
       */
      function handleChangeGameEvent(gameName) {
        Utils.tryCatch(() => {
          console.log(`player: ${name} changed game to ${gameName}`)
          r.changeGame(gameName)
        },
        e => {
          console.error('[ERROR][SOCKET]', e)
          sendMessage('self', 'Oops, something wrong occurred on the server.', 'error')
          socket.disconnect()
        })
      }

      /**
       * StartGame: handle start game event
       * 
       */
      function handleStartGameEvent() {
        Utils.tryCatch(() => {
          console.log(`player: ${name} started game ${r.game.name}`)
          r.game.start()
        },
        e => {
          console.error('[ERROR][SOCKET]', e)
          sendMessage('self', 'Oops, something wrong occurred on the server.', 'error')
          socket.disconnect()
        })
      }

      /**
       * SubmitAnswer: handle submit an answer event
       * 
       */
      function handleSubmitAnswerEvent(answer) {
        Utils.tryCatch(() => {
          r.submitPlayerAnswer(id, answer)
        },
        e => {
          console.error('[ERROR][SOCKET]', e)
          sendMessage('self', 'Oops, something wrong occurred on the server.', 'error')
          socket.disconnect()
        })
      }

      /**
       * Disconnect: handle socket disconnection
       * 
       */
      function handleDisconnectEvent() {
        Utils.tryCatch(() => {
          console.log(`player: ${name} is disconnected from room: ${room}`)
          r.disconnectPlayer(id)
        },
        e => {
          console.error('[ERROR][SOCKET]', e)
          sendMessage('self', 'Oops, something wrong occurred on the server.', 'error')
          socket.disconnect()
        })
      }
      
      /**
       * socket listeners
       * 
       */
      socket.on('enterGame', handleEnterGameEvent)
      socket.on('changeGame', handleChangeGameEvent)
      socket.on('startGame', handleStartGameEvent)
      socket.on('submitAnswer', handleSubmitAnswerEvent)
      socket.on('disconnect', handleDisconnectEvent)


      /**
       * send message via socket
       * 
       * @param {String} to self|cast|room
       * @param {String} text text message 
       * @param {String} type success|error|warning|info|NULL
       */
      function sendMessage(to, text, type) {
        switch(to) {
          case 'self':
            socket.emit('message', { text, type })
            break
          
          case 'cast':
            socket.broadcast.to(room).emit('message', { text, type })
            break
          
          case 'room':
            io.to(room).emit('message', { text, type })
            break
          
          default:
            console.error('[ERROR][SOCKET]', `Unsupported value of "to" param: ${to}`)
        }
      }
    },
    e => {
      console.error('[ERROR][SOCKET]', e)
      sendMessage('self', 'Oops, something wrong occurred on the server.', 'error')
      socket.disconnect()
    })
  }
}