import React from 'react'
import { Toaster } from 'react-hot-toast'
import Signup from './auth/SIgnup.jsx'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import Login from './auth/Login.jsx'
import Home from './Home/Home.jsx'
import { useState } from 'react'
import RefreshHandler from './config/RefreshHandler.jsx'
import Navbar from './components/Navbar.jsx'
import Albums from './albums/Albums.jsx'
import Likes from './Likes/Likes.jsx'
import Profile from './profile/Profile.jsx'
import AddAlbum from './components/AddAlbum.jsx'
import AddSong from './components/AddSong.jsx'
import MyAlbums from './albums/MyAlbums.jsx'
import MySongs from './Home/MySongs.jsx'
import AllAlbums from './albums/AllAlbums.jsx'
import AllSongs from './Home/AllSongs.jsx'
import ViewAlbums from './albums/ViewAlbums.jsx'
import SearchNav from './components/SearchNav.jsx'
import SearchResults from './Home/SearchResults.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import { useContext } from 'react'
import { playContext } from './Context/PlaySongContext.jsx'

const App = () => {

  const [IsAuth, setIsAuth] = useState(false)
  const [role, setrole] = useState(null);

  const {current} = useContext(playContext);

  const protectRoutes = (element)=>{
    return IsAuth ? element : <Navigate to="/login" />
  }

  return (
    <>
    <RefreshHandler setisAuth={setIsAuth} />
    <SearchNav />
    <div className="app">

    <Navbar role={role} setrole={setrole} />
      <Toaster position='top' />
     <main>
       <Routes>
        <Route path='/' element={<Login setrole={setrole} />} />
        <Route path='/login' element={<Login setrole={setrole} />} />
        <Route path='/signup' element={<Signup setrole={setrole} />} />
        <Route path='/home' element={protectRoutes(<Home />)} />
        <Route path='/albums' element={protectRoutes(<Albums/>)} />
        <Route path='/likes' element={protectRoutes(<Likes />)} />
        <Route path='/profile' element={protectRoutes(<Profile />)} />
        <Route path='/add_album' element={protectRoutes(<AddAlbum/>)} />
        <Route path='/add_song' element={protectRoutes(<AddSong/>)} />
        <Route path='/myalbums' element={protectRoutes(<MyAlbums/>)} />
        <Route path='/mysongs' element={protectRoutes(<MySongs />)} />
        <Route path='/all_albums' element={protectRoutes(<AllAlbums/>)} />
        <Route path='/all_songs' element={protectRoutes(<AllSongs />)} />

        <Route path='/albums/:id' element={protectRoutes(<ViewAlbums />)} />
        <Route path='/search' element={protectRoutes(<SearchResults />)} />
        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Routes>
      {current ? <MusicPlayer /> : <></>}
     </main>
    </div>
    </>
  )
}

export default App