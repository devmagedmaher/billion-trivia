const fs = require('fs')
const path = require('path');
const Game = require('./models/game');


const absolutePath = path.join(__dirname, 'models', 'game', 'games');

const list = []

fs.readdirSync(absolutePath).forEach(fileName => {
  // import game file
  const Class = require(`${absolutePath}/${fileName}`)

  // check if game extends Game Class
  if (!(Class.prototype instanceof Game)) {
    throw new Error(`"${fileName}" does not extends Game Class`)
  }

  // create gmae object
  const game = { Class, data: new Class().getInfo() }

  // if game name is duplicated throw an error
  const duplicated = list.find(g => g.data.name === game.data.name)
  if (duplicated) {
    throw new Error(`"${game.data.name}" game is duplicated`)
  }

  if (Class.__isActive) {
    list.push(game)
  }
});

module.exports = list