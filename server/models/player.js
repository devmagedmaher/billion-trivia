const SocketIO = require('./socketIO')


class Player extends SocketIO {

  /**
   * Unique string id
   * 
   * @type {String}
   */
  id = ''

  /**
   * Player name
   * 
   * @type {String}
   */
  name = ''

  /**
   * Is admin
   * 
   * @type {Boolean}
   */
  isAdmin = false

  /**
   * Is player client connected to server
   * 
   * @type {Boolean}
   */
  isConnected = true

  /**
   * Is player inside a game or a spectator
   * 
   * @type {Boolean}
   */
  isInGame = false

  /**
   * Total game score
   * 
   * @type {Integer}
   */
  score = 0

  /**
   * Score in single game round
   * 
   * @type {Integer}
   */
  scoreInRound = 0

  /**
   * Answer of the currecnt question
   * 
   * @type {any}
   */
  answer

  /**
   * Order of answering to other players
   * 
   * @type {Integer}
   */
  answerOrder = 0

  /**
   * did player answer the question?
   * 
   * @type {Boolean}
   */
  hasAnswered = false

  /**
   * did player lost the game?
   * 
   * @type {Boolean}
   */
  hasLost = false

  /**
   * Init player
   * 
   */
  constructor(id, name, { room, io, socket }) {
    super({ room, io, socket })

    // update 
    this.id = id
    this.name = name
  }

  /**
   * set socket
   * 
   */
  __setSocket(socket) {
    this.__socket = socket
  }

  /**
   * set player name
   * 
   * @param {String} name player name
   * 
   * @returns {Player}
   */
  setName(name) {
    this.name = name
    return this
  }

  /**
   * set player is connected to the room or not
   * 
   * @param {Boolean} isConnected is player connected?
   * 
   * @returns {Player}
   */
  setIsConnected(isConnected) {
    this.isConnected = isConnected
    return this
  }

  /**
   * set player is in the game room or not
   * 
   * @param {Boolean} isInGame is player in the game room
   * 
   * @returns {Player}
   */
  setIsInGame(isInGame) {
    this.isInGame = isInGame
    return this
  }

  /**
   * set player is a game admin or not
   * 
   * @param {Boolean} isAdmin is player a game admin or not
   * 
   * @returns {Player}
   */
  setIsAdmin(isAdmin) {
    this.isAdmin = isAdmin
    return this
  }

  /**
   * set player score in game
   * 
   * @param {Boolean} score score of current game
   * 
   * @returns {Player}
   */
  setScore(score) {
    this.score = score
    return this
  }

  /**
   * set player score in round
   * 
   * @param {Boolean} scoreInRound score of current round
   * 
   * @returns {Player}
   */
  setScoreInRound(scoreInRound) {
    this.scoreInRound = scoreInRound
    return this
  }

  /**
   * set has player answered flag
   * 
   * @param {Boolean} hasAnswered
   * 
   * @returns {Player}
   */
  setHasAnswered(hasAnswered) {
    this.hasAnswered = hasAnswered
    return this
  }

  /**
   * set has player lost the game
   * 
   * @param {Boolean} hasLost
   * 
   * @returns {Player}
   */
  setHasLost(hasLost) {
    this.hasLost = hasLost

    if (hasLost === true) {
      this.selfMessage('You have lost the game!!', 'error')
      this.castMessage(`${this.name} has lost the game.`, 'error')
    }

    return this
  }

  /**
   * clear current answer
   * 
   * @returns {Player}
   */
  clearAnswer() {
    this.answer = null
    this.answerOrder = null
    this.hasAnswered = false
    return this
  }

  /**
   * clear lost state
   * 
   * @returns {Player}
   */
  clearLost() {
    this.hasLost = false
    return this
  }

  /**
   * submit an answer
   * 
   */
  submitAnswer(answer, order) {
    this.answer = answer
    this.answerOrder = order
    this.hasAnswered = true
  }

  /**
   * convert instance to object
   * 
   * @returns {Object}
   */
  toObject() {
    const { ...object } = this

    // delete private props and methods
    Object.keys(object).forEach(key => {
      if (key.startsWith('__')) {
        delete object[key]
      }
    })

    return object
  }
}


module.exports = Player