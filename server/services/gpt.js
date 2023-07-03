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

const createChatCompletion = async (messages, {
  user_id = 'thebillionaire',
  max_tokens = 256,
  temperature = 0.25,
} = {}) => {
  return openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    max_tokens,
    temperature,
    user: String(user_id),
  })
  .then(res => res.data)
}


const GenerateMultipleChiocesQuestionLegacy = async ({
  categories = ['General'],
  exclude = [],
  instructions,
} = {
  categories: ['General'],
  exclude: [],
  difficulty: 3
}) => {
  let prompt = `You are an API endpoint which takes input and provides output in a predefined JSON format. The output object will contain 4 keys: 'question', 'category', 'options', and 'answer'. 'question' is a string value, 'category' is a string value, 'options' is an array of 4 objects with 2 keys: 'id' and 'text'. 'answer' is also an object with 'id' and 'text' keys which matches the 'options'. All keys and values must be in JSON format.\n`
  prompt += 'Question and answer must be verfied and legit information, Question must not contain the answers, Do not ask common sense questions, Generate only one correct option that equals answers and 3 incorrect options, all options must be different.\n'
  prompt += `generate trivia question about "${categories}". exclude questions about: "${exclude}".\n`
  prompt += instructions ? `Instructions: ${instructions}\n` : ''
  console.log(prompt)

  return createCompletion(prompt, { temperature: 0 })
  .then(data => data.choices[0].text)
  .then(text => {
    console.log(text)
    return JSON.parse(text)
  })
}

const GenerateRoundQuestion = async (messages, round = 1, category = '', excludes = []) => {
  let system = `Act like an API endpoint which takes input and provides output in a predefined JSON format. The output object will contain 4 keys: 'question', 'category', 'options', and 'answer'. 'question' is a string value, 'category' is a string value, 'options' is an array of 4 objects with 2 keys: 'id' and 'text'. 'answer' is also an object with 'id' and 'text' keys which matches the 'options'. All keys and values must be in JSON format. Question and answer must be verfied and legit information, Question must not contain the answers, Do not ask common sense questions, Options must have only one correct answer and 3 different wrong answers.`
  let message = (round, category) =>  `For a trivia game of 20 rounds. this is how player awarded each round: $1, $10, $100, $1,000, $10,000, $50,000, $100,000, $250,000, $500,000, $750,000, $1,500,000, $3,000,000, $6,000,000, $12,000,000, $25,000,000, $50,000,000, $100,000,000, $200,000,000, $500,000,000, $1,000,000,000, And each round the difficulty of the question increases according to the round award.
  For round ${round}, generate question in category: "${category}". Exclude these topics: "${excludes}"`

  if (round <= 1) {
    messages.unshift(
      { role: 'system', content: system },
      { role: 'user', content: message(round, category) }
    )
  }
  else {
    messages.push({ role: 'user', content: message(round, category) })
  }

  // console.log(messages)
  return createChatCompletion(messages, { temperature: 0.7 })
  .then(data => data.choices[0].message)
  .then(message => {
    // messages.push(message)
    const result = JSON.parse(message.content)
    return { messages, result }
  })
}


module.exports = {
  createCompletion,
  createChatCompletion,

  GenerateRoundQuestion,
}