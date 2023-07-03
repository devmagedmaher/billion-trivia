import React from 'react'
import Input from '../input'
import { useRoom } from '.'

const GameInput = ({ onChange }) => {
  const { data: room } = useRoom()
  const { game } = room
  const [categories, setCategories] = React.useState(() => game.categories)

  React.useEffect(() => {
    onChange?.({ categories })
  }, [categories, onChange])

  return (
    <div>
      <Input
        name="categories"
        value={categories}
        label="Categories"
        placeholder="History, Geography, TV Shows, Traditions, Unusual Facts, Arabic Language, African Culture"
        onChange={setCategories}
        showLabel
        multiline
        mb="sm"
      />
    </div>
  )
}

export default GameInput