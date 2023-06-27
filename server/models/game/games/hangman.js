const Game = require('..')
const words = require('../../../services/words')
const Utils = require('../../../utils')

class FlagsGame extends Game {

  /**
   * is game active?
   * 
   * @type {Boolean}
   */
  static __isActive = true

  /**
   * Init game
   */
  constructor(props) {
    super('hangman', 'Guess the word', props)
  }


  /**
   * construct questions array
   * 
   * 
   */
  async buildRounds() {
    for (let i = 0; i < this.rounds; i++) {
      const q = await this.buildQuestion()
      this.__questions.push(q)
    }
  }

  /**
   * construct question object
   * 
   */
  async buildQuestion() {
    const { word, definition } = await words.random()

    const chars = word.split('').map(c => Math.random() > 0.5 ? c : '_')

    return {
      text: definition,
      chars,
      answer: { text: word },
    }
  }

  /**
   * (Override) calculate players scoring in current round
   * 
   */
   setPlayersScoreInRound() {
    // get in game players
    this.__roomInstance.getInGamePlayers()

    // filter players that didn't submit an answer
    .filter(p => p.hasAnswered)

    // loop and calculate
    .forEach((player, _, players) => {
      // const total = players.length
      // const score = total - player.__answerOrder
      const accuracy = Utils.getSimilarity(player.__answer, this.answer.text)

      // if he answered right
      if (accuracy > 0.50) {
        // add plus score points
        player.setScoreInRound(Math.round(accuracy * 100))
      }

      // if he answered wrong
      else {
        // add minus score points
        player.setScoreInRound(Math.round((1 - accuracy) * -100))
      }

      // clear player answer
      player.clearAnswer()
    })
  }
}


module.exports = FlagsGame