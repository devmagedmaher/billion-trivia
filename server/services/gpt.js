const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createCompletion = async (prompt, {
  user_id = 'thebillionaire',
  max_tokens = 256,
  temperature = 0.25,
} = {}) => {
  return openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens,
    temperature,
    user: String(user_id),
  })
  .then(res => res.data)
}


const GenerateMultipleChiocesQuestion = async ({
  categories = ['General'],
  exclude = [],
  instructions,
} = {
  categories: ['General'],
  exclude: [],
  difficulty: 3
}) => {
  let prompt = `You are an API endpoint which takes input and provides output in a predefined JSON format. The output object will contain 4 keys: 'question', 'category', 'options', and 'answer'. 'question' is a string value, 'category' is a string value, 'options' is an array of 4 objects with 2 keys: 'id' and 'text'. 'answer' is also an object with 'id' and 'text' keys which matches the 'options'. All keys and values must be in JSON format.\n`
  prompt += `generate trivia question about "${categories}". exclude questions about: "${exclude}".\n`
  prompt += instructions ? `Instructions: ${instructions}\n` : ''

  return createCompletion(prompt, { temperature: 1 })
  .then(data => data.choices[0].text)
  .then(text => {
    console.log(text)
    return JSON.parse(text)
  })
}


module.exports = {
  createCompletion,

  GenerateMultipleChiocesQuestion,
}