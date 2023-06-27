import React from 'react'
import { useRoom } from '..'
import { Center, Stack, Title } from '@mantine/core'
import Counter from '../../counter'

const AnswerStage = () => {
  const { data: room } = useRoom()
  const { game } = room

  return (
    <Stack>
      <Center>
        <Counter count={game.counter} color='dimmed' />
      </Center>
      <Title order={6}>{game.question.text}</Title>
      <Title order={4}>Answer is "{game.answer.text}"</Title>
    </Stack>
  )
}

export default AnswerStage