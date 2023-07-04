import React from 'react'
import { useRoom } from '..'
import { Center, Container, Loader } from '@mantine/core'
import QuestionStage from './QuestionStage'

const GameStages = () => {
  const { data: room } = useRoom()
  const { game } = room

  const renderGameStage = () => {
    if (game.isLoading || !game.question) {
      return <Loader />
    }
    else {
      return <QuestionStage />
    }
  }

  return (
    <Container>
      <Center>
        {renderGameStage()}
      </Center>
    </Container>
  )
}

export default GameStages