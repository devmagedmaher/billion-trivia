import React from 'react'
import { Text } from '@mantine/core'

const Counter = ({ count, withWarning, color = 'green', ...props }) => {

  const getColor = () => {
    if (withWarning) {
      if (count < 5) {
        return 'red'
      }
      else if (count < 10) {
        return 'yellow'
      }
    }

    return color
  }

  return (
    <Text  size="lg" {...props} color={getColor()}>
      {count > 0 ? count : null}
    </Text>
  )
}

export default Counter