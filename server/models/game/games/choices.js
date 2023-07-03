const Game = require('..')
const gpt = require('../../../services/gpt')


class ChoicesGame extends Game {

  /**
   * is game active?
   * 
   * @type {Boolean}
   */
  static __isActive = true

  /**
   * default minimum players required to start the game
   * 
   * @type {Integer}
   */
  min_players = 1

  /**
   * total rounds of the game
   * 
   * @type {Integer}
   */
  rounds = 20

  /**
   * score of each round
   * 
   * @type {Array}
   */
  scores = [0, 1, 10, 100, 1000, 10000, 50000, 100000, 250000, 500000, 750000, 1500000, 3000000, 6000000, 12000000, 25000000, 50000000, 100000000, 200000000, 500000000, 1000000000]

  /**
   * timer of each round
   * 
   * @type {Array}
   */
  timers = [30, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 9, 8, 7, 6, 6, 5, 5, 5, 5]

  /**
   * categories of the questions
   * 
   * @type {String}
   */
  categories = ''

  /**
   * fallback categories
   * 
   * @type {String}
   */
  __defaultCategories = ['History','Geography','Science','Sports','Movies','Music','Art and Literature','Technology','Food and Drink','Pop Culture','Politics','Celebrities','Animals','Mythology','General Knowledge','TV Shows','Mathematics','World Records','Language and Linguistics','Famous Quotes','Fashion and Style','Architecture','Astronomy','Inventions and Discoveries','Nature and Environment','Medicine and Health','Video Games','Books and Authors','Mythical Creatures','Trivia about Trivia','Cars and Automobiles','Psychology','Cryptocurrency','Business and Economics','Famous Landmarks','Space Exploration','Weather and Climate','Sports Teams and Athletes','Fashion Designers','Fine Arts','Religion and Spirituality','Cartoons and Animation','Dance and Ballet','Philosophy','Cooking and Recipes','Martial Arts','Famous Battles','Famous Inventors','Comedy and Stand-up','Flags of the World','Famous Explorers','Environmental Issues','Famous Trials','Music Genres','Historical Figures','Board Games','Health and Fitness','Science Fiction','Famous Speeches','Wonders of the World','Nobel Prize Winners','Automobile Brands','Famous Ships','Fashion Icons','Natural Disasters','Scientific Theories','Broadway Musicals','Wildlife and Conservation','Film Directors','Famous Rulers and Monarchs','Famous Paintings','Ancient Civilizations','Vintage TV Shows','Cultural Traditions','Famous Photographs','Famous Scientists','Architecture Styles','Horror Movies','Olympic Games','Music Instruments','World Religions','Alternative Medicine','Famous Heists','Superheroes','Game Shows','Famous Composers','Famous Architects','Classical Literature','World Currencies','Famous Landmarks','Computer Science','Famous Quotes','Fashion Brands','Unusual Facts','Nobel Prize Categories','Famous Artifacts','Disney Movies','Ancient Mythologies','U.S. Presidents','Oddities and Curiosities']

  /**
   * chat messages for AI
   * 
   * @type {Array}
   */
  __messages = []

  /**
   * Init game
   */
  constructor(props) {
    super('choices', 'multiple choices', props)
  }

  /**
   * construct questions array
   * 
   * 
   */
  async buildRounds() {
    try {
      const categories = this.categories.length ? this.categories.split(',') : this.__defaultCategories
      const category = categories[Math.floor(Math.random() * categories.length)]
      const excludes = this.__questions.map(q => [q.text, q.answer.text]).flat()
      const { messages, result } = await gpt.GenerateRoundQuestion(this.__messages, this.__questions.length + 1, category, excludes)

      const q = this.buildQuestion(result)
      this.__questions.push(q)

      this.__messages = messages

      console.log(this.__messages)
      console.log(this.__questions)
      return this.__questions
    }
    catch(e) {
      console.log('Failed to generate question!')
      console.log(e.toString())
      return false
    }
  }

  /**
   * construct question object
   * 
   * @param {Array} data question data
   * 
   * @return {Object}
   */
  buildQuestion(data) {
    const { question, options, answer, category } = data

    return {
      text: question,
      options,
      answer,
      category,
    }
  }

  /**
   * complete one more question
   * 
   * 
   */
  async completeQuestions() {
    const q = await this.buildRounds()
    if (this.__questions.length < this.rounds && this.started) {
      if (q === false) {
        await new Promise(r => setTimeout(r, 2000))
      }
      await new Promise(r => setTimeout(r, 1000))
      await this.completeQuestions()
    }
  }

  /**
   * calculate players scoring in current round
   * 
   */
  setPlayersScoreInRound() {
    // get in game players
    this.__roomInstance.getInGamePlayers()

    // filter players that didn't submit an answer
    .filter(p => !p.hasLost)

    // loop and calculate
    .forEach((player, _) => {
      // if he answered incorrect
      if (String(player.__answer) !== String(this.answer.id) || !player.hasAnswered) {
        // mark player as loser
        player.setHasLost(true)
      }

      // if he answered correct
      else {
        // add positive score points
        player.setScoreInRound(this.scores[this.round] - player.score || 1)
      }

      // clear player answer
      player.clearAnswer()
    })
  }
}


module.exports = ChoicesGame