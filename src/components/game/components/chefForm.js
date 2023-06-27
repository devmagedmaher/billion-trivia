import React from 'react'
import { useForm } from '@mantine/form'
import {
  Container,
  Stack,
  Button,
  Title,
} from '@mantine/core'
import { useGame } from '..'
import Input from '../../input'

const ChefForm = () => {
  const { game, socket } = useGame()
  const form = useForm({
    initialValues: {
      recipe: '',
    },
    validate: {
      recipe: val => val === '' ? 'Please enter your recipe' : null, 
    }
  })

  const submitRecipe = () => {
    form.validate()
    if (form.isValid()) {
      const { recipe } = form.values

      // send recipe
      socket.emit('submitRecipe', recipe)
    }
  }

  return (
    <Container>
      <Stack>
        <Title order={1} align="center">{game.countDown}</Title>

        <Input
          name="recipe"
          label={`${game.food.name} is:`}
          showLabel={true}
          value={form.values.recipe}
          error={form.errors.recipe}
          onChange={text => form.setFieldValue('recipe', text)}
          onEnter={submitRecipe}
          size="lg"
          autoFocus={true}
        />
        
        <Button
          onClick={submitRecipe}
          variant="light"
          size='md'
        >Submit</Button>
      </Stack>
    </Container>
  )
}

export default ChefForm