import React from 'react'
import { useRoom } from '..'
import { Center, createStyles, Image, Radio, Stack, Title } from '@mantine/core'
import Counter from '../../counter'
import Input from '../../input'

const useStyles = createStyles(theme => ({
  
  image: {
    width: 250,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      width: '50vw',
      maxWidth: 250
    }
  }
}))

const QuestionStage = () => {
  const { classes } = useStyles()
  const { data: room, me, socket } = useRoom()
  const { game } = room
  const { question } = game

  return (
    <Stack>
      <Center>
        <Counter count={game.counter} withWarning />
      </Center>
      <Title order={5}>{question.text}</Title>
      {question.image ? <Image src={question.image} alt={question.text} className={classes.image} /> : null}
      {question.chars ? <Title order={3}>{question.chars.map(c => ` ${c} `).join(' ')}</Title> : null}
      {question.options ? <RadioOptions /> : <TextInput />}
    </Stack>
  )
}

const TextInput = () => {
  const { me, socket } = useRoom()
  const [answer, setAnswer] = React.useState('')

  const handleOnSubmit = () => {
    // prevent onEnter if player answer was already submitted
    if (me.hasAnswered) return false

    // send answer
    socket.emit('submitAnswer', answer)

    // clear answer text input
    setAnswer('')
  }

  return (
    <Input
      name="answer"
      label="Type your answer"
      value={answer}
      onChange={text => setAnswer(text)}
      onEnter={handleOnSubmit}
      disabled={me.hasAnswered}
      size="lg"
    />
  )
}

const RadioOptions = () => {
  const { data: room, me, socket } = useRoom()
  const { question } = room.game

  const handleOnChange = (answer) => {
    // send answer
    socket.emit('submitAnswer', answer)
  }

  return (
    <Radio.Group
      name="answer"
      onChange={handleOnChange}
      orientation="vertical"
      label={`Select your answer:`}
    >
      {question.options.map(option => (
        <Radio
          value={option.id}
          label={option.text}
          disabled={me.hasAnswered}
        />
      ))}
    </Radio.Group>
  )
}

export default QuestionStage