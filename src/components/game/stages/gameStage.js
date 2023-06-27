import React from 'react'
import { useGame } from '..'
import {
  Container,
  Stack,
  Title,
} from '@mantine/core'
import ChefForm from '../components/chefForm'
import FoodSelect from '../components/foodSelect'

const GameStage = () => {
  const { game, id } = useGame()

  if (game.recipe) {
    return (
      <FoodSelect />
    )
  }

  if (game.chef?.id === id) {
    return (
      <ChefForm />
    )
  }

  return (
    <Container>
      <Stack>
        <Title order={1} align="center">{game.countDown}</Title>
        <Title order={3} align="center">Wait for Chef recipe</Title>
      </Stack>
    </Container>
  )
}

export default GameStage