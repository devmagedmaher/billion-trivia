import React from 'react'
import { AppShell, Box, Center, Container } from '@mantine/core'
import Header from './header'

const Layout = ({
  header = true,
  headerProps = {},
  navbar,
  centerize = true,
  children,
}) => {
  return (
    <AppShell
      header={header ? <Header {...headerProps} /> : null}
      navbar={navbar}
    >
      <Container fluid style={{ height: '100%' }}>
        {centerize
          ? <Center style={{ height: '100%' }}>
              {children}
            </Center>

          : <Box style={{ height: '100%' }}>
            {children}
          </Box>
        }
      </Container>
    </AppShell>
  )
}

export default Layout