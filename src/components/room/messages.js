import React from 'react'
import { ActionIcon, createStyles, Divider, Group, Paper, ScrollArea, Text } from '@mantine/core'
import { IconArrowDown, IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons'
import { useRoom } from '.'

const useStyles = createStyles((theme) => ({
  paper: {
    width: '100%',
  },

  scrollArea: {
    transition: 'height 100ms ease-in-out, padding-top 100ms ease-in-out',
    height: 240,
    paddingTop: 12,
  },

  scrollAreaMini: {
    height: 80
  },

  scrollAreaClosed: {
    height: 0,
    paddingTop: 0,
  }
}))

const Messages = () => {
  const { classes } = useStyles()
  const { messages } = useRoom()
  const [mini, setMini] = React.useState(false)
  const [open, setOpen] = React.useState(true)

  const renderScrollAreaClasses = () => {
    return `${classes.scrollArea} ${
      !open 
        ? classes.scrollAreaClosed
        : mini
          ? classes.scrollAreaMini
          : ''
    }`
  }

  const toggleMiniMax = () => {
    setMini(mini => !mini)
  }

  const toggleOpenClose = () => {
    setOpen(open => !open)
  }

  return (
    <Paper className={classes.paper} withBorder>
      <Group position='apart' p="xs">
        <Text>Messages</Text>
        <Group position='right'>
          {open ? <ActionIcon
            onClick={toggleMiniMax}
            color="blue"
            size='md'
          >
            <IconArrowDown size={16} style={{ transform:`scaleY(${mini ? -1 : 1})` }} />
          </ActionIcon> : null}
          <ActionIcon
            onClick={toggleOpenClose}
            color="red"
            size='md'
          >
            {open ? <IconArrowsMinimize size={16} /> : <IconArrowsMaximize size={16} />}
          </ActionIcon>
        </Group>
      </Group>
      <Divider />
      <ScrollArea
        type="auto"
        offsetScrollbars
        className={renderScrollAreaClasses()}
      >
        {messages.map((message, index) => (
          <Message message={message} index={index} />
        ))}
      </ScrollArea>
    </Paper>
  )
}

const Message = ({ message, index }) => {
  const { text, type } = message

  const getColor = () => {
    switch(type) {
      case 'success':
        return 'green'

      case 'error':
        return 'red'

      case 'warning':
        return 'yellow'

      case 'info':
        return 'blue'

      default:
        return ''
    }
  }

  return (
    <Text key={index} pl="sm" color={getColor()}>{text}</Text>
  )
}

export default Messages