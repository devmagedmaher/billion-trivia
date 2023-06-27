import React from 'react'
import Input from '../input'

const GameInput = ({ onChange }) => {
  const [categories, setCategories] = React.useState('')
  const [instructions, setInstructions] = React.useState('')
  const timer = React.useRef()

  React.useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange({ categories, instructions }), 1000)
  }, [categories, instructions])

  return (
    <div>
      <Input
        name="categories"
        value={categories}
        label="Categories"
        onChange={setCategories}
      />
      <Input
        name="instructions"
        value={instructions}
        label="Instructions"
        onChange={setInstructions}
      />
    </div>
  )
}

export default GameInput