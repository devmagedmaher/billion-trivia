import React from 'react'
import { io } from 'socket.io-client'
import Layout from '../layout'
import IntroStage from './introStage'
import LobbyStage from './lobbyStage'
import GameStages from './gameStages'
import Sidebar from './sidebar'
import Messages from './messages'
import { Center, Grid, Stack } from '@mantine/core'
import FullScreenButton from '../fullScreenButton'

const RoomContext = React.createContext({
  setStage: () => false,
  status: null,
  data: {
    players: [],
    game: {},
  },
});


const Room = (props) => {
  const [stage, setStage] = React.useState()
  const stageRef = React.useRef()
  const [status, setStatus] = React.useState('loading')
  const [data, setData] = React.useState({
    players: [],
    game: {},
  })
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [me, setMe] = React.useState()
  const [messages, setMessages] = React.useState([])

  // const socketRef = React.useRef(io('http://192.168.121.254:5000', {
  const socketRef = React.useRef(io('http://localhost:5000', {
    autoConnect: false,
    query: {
      room: props.room,
      name: props.name,
      id: props.id,
    }
  }))
  const [socket, setSocket] = React.useState()


  // update socket state
  React.useEffect(() => {
    if (socketRef.current) {
      setSocket(socketRef.current)
    }
  }, [socketRef])
  
  // update stage ref
  React.useEffect(() => { stageRef.current = stage }, [stage])

  /**
   * connect and listen to socket events
   * 
   */
  React.useEffect(() => {
    if (socket) {
      // connect to socket server
      setStatus('loading')
      socket.connect()
  
  
      socket.on('connect', handleConnect)
      socket.on('disconnect', handleDisconnect)
      socket.on('refresh', handleRoomRefreshData)
      socket.on('message', handleRceiveMessage)
  
      return () => {
        socket.disconnect()
        socket.off('connect')
        socket.off('disconnect')
        socket.off('message')
        socket.off('refresh')
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  /**
   * handle socket connection
   * 
   */
  const handleConnect = () => {
    console.log('connected')
    setStatus()
    setMessages([])
  }

  /**
   * handle socket disconnect
   * 
   */
  const handleDisconnect = () => {
    console.log('disconnect')
    setStatus('disconnected')
    setStage()
  }

  /**
   * handle refresh room data
   */
  const handleRoomRefreshData = data => {
    console.log('refreshed data', data)
    setData(currentData => ({ ...currentData, ...data }))
  }

  /**
   * handle changing of data room/game/players
   */
  React.useEffect(() => {
    if (data.players) {
      const me = data.players.find(p => p.id === props.id)
      if (me) {
        setIsAdmin(me.isAdmin)
        setMe(me)
    
        if (me.isInGame) {
          const { game } = data

          if (game.started) {
            if (stage !== 'game') {
              setStage('game')
            }
          }
          else {
            if (stage !== 'lobby') {
              setStage('lobby')
            }
          }
        }
        else {
          if (stage !== 'intro') {
            setStage('intro')
          }
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  /**
   * handle recieve messages
   * 
   */
  const handleRceiveMessage = message => {
    console.log(message)
    setMessages(messages => [ message, ...messages ])
  }

  // /**
  //  * handle game started
  //  * 
  //  */
  // const handleGameStarted = () => {
  //   if (stageRef.current === 'lobby') {
  //     console.log('game started')
  //     setStage('game')
  //   }
  // }

  // /**
  //  * handle game paused
  //  * 
  //  */
  // const handleGamePaused = () => {
  //   if (stageRef.current === 'game') {
  //     console.log('game paused')
  //     setStage('lobby')
  //   }
  // }


  /**
   * render room stages
   * 
   */
  const renderStage = () => {
    switch (stage) {
      case 'lobby':
        return <LobbyStage />

      case 'game':
        return <GameStages />

      default:
        return <IntroStage />
    }
  }

  /**
   * render game with game state/data
   * 
   */
  return (
    <RoomContext.Provider value={{
      socket,
      status,
      data,
      me,
      isAdmin,
      messages,
      ...props
    }}>
      <Layout navbar={<Sidebar />} centerize={false}>
        <FullScreenButton />
        <Grid grow style={{ height: '100%' }}>
          <Grid.Col md={9} xs={12}>
            <Center style={{ height: '100%' }}>
              {renderStage()}
            </Center>
          </Grid.Col>
          <Grid.Col lg="content" xs={12}>
            <Stack justify="flex-end" style={{ height: '100%' }}>
              <Messages />
            </Stack>
          </Grid.Col>
        </Grid>
      </Layout>
    </RoomContext.Provider>
  )
}

export default Room

export const useRoom = () => React.useContext(RoomContext)