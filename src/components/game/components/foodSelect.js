import React, { useState } from 'react'
import { useForm } from '@mantine/form'
import { useGame } from '..'
import { useMediaQuery } from '@mantine/hooks'
import {
  Container,
  Stack,
  Button,
  Radio,
  Title,
  Text,
  Group,
  useMantineTheme,
} from '@mantine/core'
import PlayersList from './playersList'

const FoodSelect = () => {
  const theme = useMantineTheme()
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const { game, socket, isAdmin, me } = useGame()
  // make a copy of current game players array
  const [options] = useState(() => Array.from(game.players.sort((a, b) => a.name.localeCompare(b.name))))
  const form = useForm({
    initialValues: {
      food: '',
    },
    validate: {
      food: val => val === '' ? 'Please select an answer' : null, 
    }
  })

  const submitAnswer = () => {
    form.validate()
    if (form.isValid()) {
      const { food } = form.values

      // send answer
      socket.emit('submitFood', food)
    }
  }

  const goNextRound = () => {
    socket.emit('nextRound')
  }

  const skipAnswer = () => {
    socket.emit('skipAnswer')
  }

  if (game.showFood) {
    return (
      <Container>
        <Stack>
            <Title order={2}>{game.recipe} is {game.food.name}</Title>
            <Text align='center' mb="md">
              {game.lastRound ? 'Game ends' : 'Next round'} in {game.countDown} seconds
            </Text>
            {isAdmin ? <Button
              onClick={goNextRound}
              variant="light"
              size='md'
              mb="md"
            >{game.lastRound ? 'End Game' : 'Next Round'}</Button> : null}

            {sm ? <PlayersList /> : null}
          </Stack>
      </Container>
    )
  }

  if (me.answered) {
    return (
      <Container>
        <Stack>
          <Title order={3}>Recipe: {game.recipe}</Title>
          <Text mb="md">
            Your answer is: {me.answer}. wait for other players {game.countDown}
          </Text>

          {sm ? <PlayersList /> : null}
        </Stack>
      </Container>    
    )
  }

  return (
    <Container>
      <Stack>
        <Title order={3}>Recipe: {game.recipe}</Title>

        <Radio.Group
          name="food"
          value={form.values.food}
          onChange={value => form.setFieldValue('food', value)}
          error={form.errors.food}
          orientation="vertical"
          label={`Guess the food from recipe before timeout: ${game.countDown}`}
        >
          {options.map(player => (
            <Radio value={player.id} label={player.name} />
          ))}
        </Radio.Group>
 
        <Group>
          <Button
            onClick={skipAnswer}
            variant="subtle"
            size='md'
          >
            Skip?
          </Button>
          <Button
            onClick={submitAnswer}
            disabled={form.values.food === ''}
            variant="light"
            size='md'
          >Submit Answer</Button>
        </Group>
      </Stack>
    </Container>
  )
}

export default FoodSelect