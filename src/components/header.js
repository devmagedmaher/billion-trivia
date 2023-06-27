import React from 'react'
import Logo from './logo'
import {
  ActionIcon,
  createStyles,
  Group,
  Header as MantineHeader,
  Paper,
  Text,
} from '@mantine/core'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import { IconDoorExit } from '@tabler/icons'

const HEADER_HEIGHT = 70

const useStyles = createStyles((theme) => ({
  paper: {
    width: '100%',
  },
  
}))

const Header = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const insideRoomPage = useMatch('/r/:room')
  const name = localStorage.getItem('name')

  const exitKitchen = () => {
    navigate('/join')
  }

  return (
    <MantineHeader height={HEADER_HEIGHT} p="lg" style={{ display: 'flex', alignItems: 'center' }}>
      <Paper className={classes.paper}>
        <Group position='apart'>
          <Group spacing="xs">
            <Link to='/'>
              <Logo />
            </Link>
          </Group>
          <Group>
            {insideRoomPage ? <ActionIcon
              onClick={exitKitchen}
              variant="filled"
              color='red'
              size='md'
            >
              <IconDoorExit size={16} style={{ transform: 'scaleX(-1)' }} />
            </ActionIcon> : null}
            {name ? <Text>Hello, {name}</Text> : null}
          </Group>
        </Group>
      </Paper>
    </MantineHeader>
  )
}

export default Header

export { HEADER_HEIGHT }