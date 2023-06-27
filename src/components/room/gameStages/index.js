import React from 'react'
import { useRoom } from '..'
import { Center, Container, Loader } from '@mantine/core'
import QuestionStage from './QuestionStage'
import AnswerStage from './AnswerStage'

const GameStages = () => {
  const { data: room } = useRoom()
  const { game } = room

  const renderGameStage = () => {
    if (game.isLoading) {
      return <Loader />
    }
    else if (game.answer) {
      return <AnswerStage />
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