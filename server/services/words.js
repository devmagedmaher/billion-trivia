const fetch = require('node-fetch')
const randomWords = require('random-words')

const BASE_URL = `https://api.dictionaryapi.dev/api/v2/entries/en`

module.exports.random = async () => {
  const random = randomWords()

  const { definition, word } = await fetch(`${BASE_URL}/${random}`)
    .then(response => response.json())
    .then(getWordDinfinition)

  return { word: word || random, definition }
}

const getWordDinfinition = (response) => {
  try {
    return {
      word: response[0].word,
      definition: response[0].meanings[0].definitions[0].definition
    }
  }
  catch(e) {
    return { definition: '(not found)' }
  }
}