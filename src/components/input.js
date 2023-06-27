import React from 'react'
import { Input as MantineInput } from '@mantine/core'

const Input = ({
  name,
  label,
  value,
  error,
  size,
  onChange,
  onEnter,

  showLabel = false,
  autoFocus = false,

  wrapperProps,
  ...inputProps
}) => {
  const inputRef = React.useRef()

  const handleOnKeyDown = e => {
    if (e.keyCode === 13) {
      onEnter()
    }
  }

  React.useEffect(() => {
    if (autoFocus) {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MantineInput.Wrapper
      error={error}
      label={showLabel ? label : false}
      size={size}
      {...wrapperProps}
    >
      <MantineInput
        ref={inputRef}
        name={name}
        placeholder={label}
        value={value}
        onChange={e => onChange(e.target.value)}
        invalid={error}
        size={size}
        onKeyDown={handleOnKeyDown}
        {...inputProps}
      />
    </MantineInput.Wrapper>

  )
}

export default Input