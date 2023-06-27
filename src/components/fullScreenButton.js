import React from 'react'
import { ActionIcon, createStyles } from '@mantine/core'
import { IconMaximize, IconMinimize } from '@tabler/icons'
import { HEADER_HEIGHT } from './header'

const useStyles = createStyles((theme) => ({
  button: {
    position: 'absolute',
    top: HEADER_HEIGHT + 16,
    right: 16
  }
}))

const FullScreenButton = () => {
  const [isFullscren, setIsFullscreen] = React.useState(false)
  const { classes } = useStyles()

  React.useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
          
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    }
  }, []);

  const handleToggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    else {
      console.log('going full screen')
      document.body.requestFullscreen()
    }
  }

  return (
    <ActionIcon
      onClick={handleToggleFullScreen}
      className={classes.button}
      variant="outline"
      color={isFullscren ? 'red' : 'green'}
      size="md"
    >
      {isFullscren ? <IconMinimize size={16} /> : <IconMaximize size={16} /> }
    </ActionIcon>
  )
}

export default FullScreenButton