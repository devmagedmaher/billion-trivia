const stringSimilarity = require('string-similarity')

/**
 * get random elements of array
 * 
 */
 module.exports.getRandomElements = (array, length = 1) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, length)
}

/**
 * Try Catch
 * 
 */
module.exports.tryCatch = (tryFunc, catchFunc) => {
  try {
    if (tryFunc instanceof Function) {
      tryFunc()
      return
    }

    console.log('[WARNING][TRY_CATCH]', 'tryFunct is missing')
  }
  catch(e) {
    if (catchFunc instanceof Function) {
      catchFunc(e)
      return
    }

    console.error('[ERROR][TRY_CATCH]', e)
  }
}

/**
 * get similarity between two strings
 * 
 */
module.exports.getSimilarity = (string1, string2) => {
  return stringSimilarity.compareTwoStrings(string1, string2)
}