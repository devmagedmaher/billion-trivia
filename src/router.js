import React from 'react'
import {
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import NotFoundPage from './pages/404'
import HomePage from './pages/home'
import JoinPage from './pages/join';
import RoomPage from './pages/room';

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Room Page */}
        <Route path='/r/:room' element={<RoomPage />} />
        {/* Join Page */}
        <Route path='/join' element={<JoinPage />} />

        {/* HOME PAGE */}
        <Route index element={<HomePage />} />
        {/* NOT FOUND PAGE */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  )
}

export default Router