import React from 'react'
import {
  useParams,
  Navigate,
} from 'react-router-dom'
import Room from '../components/room';

const RoomPage = () => {
  const { room } = useParams()
  const name = localStorage.getItem('name')
  const id = localStorage.getItem('id')

  React.useEffect(() => {
    localStorage.setItem('room', room)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!name || !room) {
    return <Navigate to="/join" />
  }

  return (
    <Room room={room} name={name} id={id} />
  )
}

export default RoomPage;