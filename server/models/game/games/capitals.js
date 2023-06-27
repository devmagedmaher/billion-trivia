const Game = require('..')
const countries = require('../../../services/countries')
const Utils = require('../../../utils')


class CapitalsGame extends Game {

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
    super('capitals', 'get the country capital name', props)
  }

  /**
   * construct questions array
   * 
   * 
   */
  async buildRounds() {
    // get all countries
    const data = await countries.all('name,capital,cca2')
    // make sure there is a capital
    .then(data => data.filter(c => c.capital?.length && c.name.common && c.cca2))

    for (let i = 0; i < this.rounds; i++) {
      const q = this.buildQuestion(data)
      this.__questions.push(q)
    }
  }

  /**
   * construct question object
   * 
   * @param {Array} countries all countries array
   * 
   * @return {Object}
   */
  buildQuestion(countries) {
    const choices = Utils.getRandomElements(countries, 4)
    const [target] = Utils.getRandomElements(choices)

    const options = choices.map(c => ({ text: c.capital[0], id: c.cca2 }))
    const answer = options.find(o => o.id === target.cca2)

    return {
      text: `What is the capital of "${target.name.common}" ?`,
      options,
      answer,
    }
  }
}


module.exports = CapitalsGame