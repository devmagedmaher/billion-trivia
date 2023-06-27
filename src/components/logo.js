import React from 'react'
import logo from '../assets/images/logo.png';
import { Box, Image, createStyles } from '@mantine/core'

const useStyles = createStyles(theme => ({
  logo: {
    width: 40,
  },
  
  fullSizeLogo: {
    width: 250,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      width: '50vw',
      maxWidth: 250
    }
  }
}))

const Logo = () => {
  const { classes } = useStyles()

  return (
    <div className={classes.logo}>
      <Image src={logo} alt="Chef Recipe" />
    </div>
  )
}

const FullSizeLogo = ({ animation = true }) => {
  const { classes } = useStyles()

  return animation ? (
    <Box className='vertical-animation'>
      <Box className='horizontal-animation'>
        <div className={classes.fullSizeLogo}>
          <Image src={logo} radius={10} alt="logo" />
        </div>
      </Box>
    </Box>
  ) : (
    <div className={classes.fullSizeLogo}>
      <Image src={logo} radius={10} alt="Chef Recipe" />
    </div>
  )
}

export default Logo

export { FullSizeLogo }