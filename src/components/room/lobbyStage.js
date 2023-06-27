import React from 'react'
import {
  Container,
  Stack,
  Button,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useRoom } from '.'
import PlayersList from './playersList'
import GamesList from './gamesList'

const LobbyStage = () => {
  const theme = useMantineTheme()
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const { data: room, socket, isAdmin } = useRoom()
  const { game } = room

  const handleStartGame = () => {
    socket.emit('startGame')
  }

  const handleOnGameChange = (name) => {
    if (isAdmin) {
      socket.emit('changeGame', name)
    }
  }

  const renderMessage = () => {
    if (isAdmin) {
      if (!game.name) {
        return 'You have to select a game to start'
      }
      else if (room.isGameOverflowed) {
        return `Maximum ${game.max_players} players are needed for game to start`
      }
      else if (!room.canGameStart) {
        return `Minimum ${game.min_players} players are required for game to start`
      }
      else {
        // Admin can start the game now
        return 'Other players are waiting for you to start the game!'
      }
    }
    else {
      return 'Wait for the admin to start the game'
    }
  }

  return (
    <Container>
      <Stack>
        <Text align='center'>
          {renderMessage()}
        </Text>

        <GamesList onChange={handleOnGameChange} />

        {isAdmin ? <Button 
          onClick={handleStartGame}
          disabled={!room.canGameStart}
          mb="md"
        >Start Game</Button> : null}

        {sm ? <PlayersList inGameOnly /> : null}
      </Stack>
    </Container>
  )
}

export default LobbyStage