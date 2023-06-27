import React from 'react'
import { useRoom } from '.'
import { Box, Group, Stack, Text, Title } from '@mantine/core'

const GameInfo = () => {
  const { data: room } = useRoom()
  const { game } = room

  return (
    <Box p='md'>
      <Stack>
        <Stack spacing="xs" mb="md">
          <Box>
            <Title order={4} >Game: {game.name || '(not selected)'}</Title>
            <Text size='sm' color='dimmed'>{game.description}</Text>
          </Box>
          <Group spacing='xs'>
            <Title order={6}>Categories:</Title>
            <Text size='sm'>{game.categories}</Text>
          </Group>
          <Group spacing='xs'>
            <Title order={6}>Instructions:</Title>
            <Text size='sm'>{game.instructions}</Text>
          </Group>
        </Stack>
        <Group spacing='xs'>
          <Title order={6}>Round:</Title>
          <Text size='sm'>{game.round}/{game.rounds}</Text>
        </Group>
      </Stack>
    </Box>
  )
}

export default GameInfo