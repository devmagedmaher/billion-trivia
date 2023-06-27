const fetch = require('node-fetch')

const BASE_URL = `https://restcountries.com/v3.1`

module.exports.all = (fields) => {
  return fetch(`${BASE_URL}/all?fields=${fields}`)
    .then(response => response.json())
}