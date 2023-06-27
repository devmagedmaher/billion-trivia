import React from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { createStyles, Divider, Navbar, ScrollArea, useMantineTheme } from '@mantine/core'
import { HEADER_HEIGHT } from '../header'
import PlayersList from './playersList'
import GameInfo from './gameInfo'

const SIDEBAR_WIDTH = 400
const SIDEBAR_WIDTH_MOBILE = 60

const useStyles = createStyles((theme) => ({
  scrollArea: {
    height: '100%',
  },
}))

const Sidebar = () => {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)

  return sm ? null : (
    <Navbar width={{ base: SIDEBAR_WIDTH }} height={`calc(100% - ${HEADER_HEIGHT}px)`}>
      <ScrollArea className={classes.scrollArea} type="auto">
      <Navbar.Section grow>
            <GameInfo />
        </Navbar.Section>

        <Divider size='sm' />

        <Navbar.Section grow>
            <PlayersList />
        </Navbar.Section>

        <Navbar.Section py="sm">
          {/* FOOTER */}
        </Navbar.Section>
      </ScrollArea>
    </Navbar>
  )
}

export default Sidebar

export { SIDEBAR_WIDTH, SIDEBAR_WIDTH_MOBILE }