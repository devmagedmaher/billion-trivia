import React from 'react'
import { io } from 'socket.io-client'
import GameStage from './stages/gameStage'
import IntroStage from './stages/introStage'
import LobbyStage from './stages/lobbyStage'
import Layout from '../layout'
import Sidebar from './components/sidebar'
import Messages from './components/messages'
import { Center, Grid, Stack } from '@mantine/core'
import FullScreenButton from '../fullScreenButton'

const GameContext = React.createContext({
  setStage: () => false,
  status: null,
  game: {},
});


const Game = (props) => {
  const [stage, setStage] = React.useState()
  const stageRef = React.useRef()
  const [status, setStatus] = React.useState('loading')
  const [game, setGame] = React.useState({})
  const [messages, setMessages] = React.useState([])
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [me, setMe] = React.useState()

  const { room, name, id } = props
  const socketRef = React.useRef(io({
    autoConnect: false,
    query: { room, name, id }
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
    console.log('socket established', socket)
    if (socket) {
      // connect to socket server
      setStatus('loading')
      socket.connect()
  
  
      socket.on('connect', handleConnect)
      socket.on('disconnect', handleDisconnect)
      socket.on('refresh', handleGameRefresh)
      socket.on('message', handleRceiveMessage)
      socket.on('gameStarted', handleGameStarted)
      socket.on('gamePaused', handleGamePaused)
  
      return () => {
        console.log('disconnect', socket)
        socket.disconnect()
        socket.off('connect')
        socket.off('disconnect')
        socket.off('message')
        socket.off('refresh')
        socket.off('gameStarted')
        socket.off('gamePaused')
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
   * handle refresh game data
   */
  const handleGameRefresh = data => {
    console.log('refreshed data', data)

    // set admin flag
    if (data.players[0]) {
      data.players[0].isAdmin = true
    }

    setGame(data)
    setIsAdmin(data.players[0]?.id === props.id)

    // set self player data
    setMe(() => data.players.find(p => p.id === props.id))

    // set stage depending on game status and player lists
    if (data.players.some(p => p.id === props.id)) {
      if (data.started) {
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
      if (stage !== undefined) {
        setStage()
      }
    }
  }

  /**
   * handle recieve messages
   * 
   */
  const handleRceiveMessage = message => {
    console.log(message)
    setMessages(messages => [ message, ...messages ])
  }

  /**
   * handle game started
   * 
   */
  const handleGameStarted = () => {
    if (stageRef.current === 'lobby') {
      console.log('game started')
      setStage('game')
    }
  }

  /**
   * handle game paused
   * 
   */
  const handleGamePaused = () => {
    if (stageRef.current === 'game') {
      console.log('game paused')
      setStage('lobby')
    }
  }


  /**
   * render game stages
   * 
   */
  const renderStage = () => {
    switch (stage) {
      case 'lobby':
        return <LobbyStage />

      case 'game':
        return <GameStage />

      default:
        return <IntroStage />
    }
  }

  /**
   * render game with game state/data
   * 
   */
  return (
    <GameContext.Provider value={{
      socket,
      setStage,
      status,
      game,
      messages,
      isAdmin,
      me,
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
    </GameContext.Provider>
  )
}

export default Game

export const useGame = () => React.useContext(GameContext)