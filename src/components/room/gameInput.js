import React from 'react'
import Input from '../input'
import { useRoom } from '.'

const GameInput = ({ onChange }) => {
  const { data: room } = useRoom()
  const { game } = room
  const [categories, setCategories] = React.useState(() => game.categories)
  const [instructions, setInstructions] = React.useState(() => game.instructions)
  const timer = React.useRef()

  React.useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange?.({ categories, instructions }), 1000)
  }, [categories, instructions])

  return (
    <div>
      <Input
        name="categories"
        value={categories}
        label="Categories"
        onChange={setCategories}
        multiline
        mb="sm"
      />
      <Input
        name="instructions"
        value={instructions}
        label="Instructions"
        onChange={setInstructions}
        multiline
      />
    </div>
  )
}

export default GameInput