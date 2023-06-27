const SocketIO = require("../socketIO")


class Game extends SocketIO {

  /**
   * game unique name
   * 
   * @type {String}
   */
  name = ''

   /**
    * short description
    * 
    * @type {String}
    */
  description = '' 

  /**
   * default minimum players required to start the game
   * 
   * @type {Integer}
   */
  min_players = 2

  /**
   * default maximum players can join the game
   * 
   * @type {Integer}
   */
  max_players = 16

  /**
   * Game status (started|ended)
   * 
   * @type {Boolean}
   */
  started = false

  /**
   * is game loading
   * 
   * @type {Boolean}
   */
  isLoading = false

  /**
   * current round of the game
   * 
   * @type {Integer}
   */
  round = 0

  /**
   * total rounds of the game
   * 
   * @type {Integer}
   */
  rounds = 5

  /**
   * questions
   * 
   * @type {Array}
   */
  __questions = []

  /**
   * current question
   * 
   * @type {Object}
   */
  question

  /**
   * current answer
   * 
   * @type {Object}
   */
  answer

  /**
   * Timer interval
   * 
   */
  __timer

  /**
   * count down
   * 
   * @type {integer}
   */
  counter = 0

  /**
   * Init game
   * 
   */
  constructor(name, description, { room, io } = {}) {
    super({ room: room?.name, io })

    this.name = name
    this.description = description
    this.__roomInstance = room
  }

  /**
   * get game basic information
   * 
   * @returns {Object}
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description,
      max_players: this.max_players,
      min_players: this.min_players,
    }
  }

  /**
   * start the game
   * 
   */
  start() {
    this.round = 0
    this.started = true
    this.isLoading = true
    this.__questions = []
    this.__answer = null
    this.__roomInstance.resetPlayerGameData()

    this.roomMessage(`Game "${this.name}" is loading!`, 'info')
    this.refresh(this.toObject(true))

    this.loadGame()
  }

  /**
   * load game data
   * 
   */
  async loadGame() {
    // construct questions array
    await this.buildRounds()

    // make sure game is not stopped
    if (this.started) {
      // load round data
      this.nextRound()
  
      // set loading is false after fetching questions and loading round
      this.isLoading = false
  
      this.refresh(this.toObject(true))
    }
  }

  /**
   * end the game
   * 
   */
  endGame() {
    this.started = false
    this.isLoading = false
    this.counter = 0
    this.clearTimer()
  }

  /**
   * go to the next round
   * 
   */
  nextRound() {
    if (this.round < this.rounds) {
      this.__question = this.__questions[this.round]
      const { answer, ...q } = this.__question
      this.question = q
      this.answer = null
      
      this.round += 1
      this.resetTimer()
      this.roomMessage(`Round "${this.round}" started!`, 'info')
    }
    else {
      this.endGame()
      this.roomMessage(`Game "${this.name}" ended!`, 'success')
    }
    this.moveScoreInRound()

    this.refresh(this.__roomInstance.toObject())
  }

  /**
   * show answer
   * 
   */
  showAnswer() {
    this.answer = this.__question.answer
    this.setPlayersScoreInRound()
    this.resetTimer(3)

    this.roomMessage(`Round "${this.round}" ended!`, 'success')
    this.refresh(this.__roomInstance.toObject())
  }

  /**
   * calculate players scoring in current round
   * 
   */
  setPlayersScoreInRound() {
    // get in game players
    this.__roomInstance.getInGamePlayers()

    // filter players that didn't submit an answer
    .filter(p => p.hasAnswered)

    // loop and calculate
    .forEach((player, _, players) => {
      const total = players.length

      // if he answered right
      if (player.__answer === this.answer.id) {
        // add plus score points
        player.setScoreInRound(total - player.__answerOrder)
      }

      // if he answered wrong
      else {
        // add minus score points
        player.setScoreInRound(-1)
      }

      // clear player answer
      player.clearAnswer()
    })
  }

  /**
   * move scoreInRound to score in game
   * 
   */
  moveScoreInRound() {
    this.__roomInstance.getInGamePlayers()
    .forEach(player => {
      player.setScore(player.scoreInRound + player.score)
      player.setScoreInRound(0)
    })
  }

  /**
   * handle timer (every second)
   * 
   */
  handleTimer() {
    this.counter -= 1
    // if counter ended
    if (this.counter <= 0) {
      // if answer was displayed
      if (this.answer) {
        // go to next round
        this.nextRound()
      }
      // if answer was NOT displayed
      else {
        // show answer
        this.showAnswer()
      }
    }
    else {

      this.refresh(this.toObject(true))
    }
  }

  /**
   * clear count down timer
   * 
   */
  clearTimer() {
    if (this.__timer) {
      clearInterval(this.__timer)
      this.__timer = null
    }
  }

  /**
   * reset count down timer from specific point
   * 
   * @param {Integer} from count down starting from
   * 
   */
  resetTimer(from = 15) {
    this.counter = from
    this.clearTimer()
    this.__timer = setInterval(this.handleTimer.bind(this), 1000)
  }

  /**
   * convert instance to object
   * 
   * @param {Boolean} insideObject 
   * @returns {Object}
   */
  toObject(insideObject) {
    const { ...object } = this

    // delete private props and methods
    Object.keys(object).forEach(key => {
      if (key.startsWith('__')) {
        delete object[key]
      }
    })

    if (insideObject) {
      return { game: object }
    }

    return object
  }
}


module.exports = Game