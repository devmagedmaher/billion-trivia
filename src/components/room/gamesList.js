import { Group, Radio, Text } from '@mantine/core'
import React from 'react'
import { useRoom } from '.'

const GamesList = ({ onChange }) => {
  const { data: room, isAdmin } = useRoom()
  const { game, games } = room

  return (
    <Radio.Group
      name="game"
      value={game.name}
      onChange={onChange}
      orientation="vertical"
      label={`Choose a game:`}
    >
      {games.map(game => (
        <Radio
          value={game.name}
          label={<GameLabel {...game} />}
          disabled={!isAdmin}
        />
      ))}
    </Radio.Group>
  )
}

const GameLabel = ({ description, ...game }) => (
  <Group spacing='xs'>
    <Text size='sm'>{description}</Text>
    <Text size='xs' color='teal'>{`${game.min_players}-${game.max_players} players`}</Text>
  </Group>
)

export default GamesList