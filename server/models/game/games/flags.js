const Game = require('..')
const countries = require('../../../services/countries')
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
    super('flags', 'get the country flag name', props)
  }


  /**
   * construct questions array
   * 
   * 
   */
  async buildRounds() {
    // get all countries
    const data = await countries.all('name,flags,cca2')
      // make sure there is a capital
      .then(data => data.filter(c => c.flags && c.name?.common && c.cca2))

    for (let i = 0; i < this.rounds; i++) {
      const q = await this.buildQuestion(data)
      this.__questions.push(q)
    }
  }

  /**
   * construct question object
   * 
   */
  async buildQuestion(countries) {
    const choices = Utils.getRandomElements(countries, 4)
    const [target] = Utils.getRandomElements(choices)

    const options = choices.map(c => ({ text: c.name.common, id: c.cca2 }))
    const answer = options.find(o => o.id === target.cca2)

    return {
      text: `What is the country of this flag ?`,
      image: target.flags.png,
      options,
      answer,
    }
  }
}


module.exports = FlagsGame