import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import {Link} from 'react-router-dom'
const Navbar = ({role}) => {

  return (
    <>
    <header>
        <nav>
            <ul>
                <li><Link to='/home' >songs</Link></li>
                <li><Link to='/albums' >albums</Link></li>
                <li><Link to='/likes' >like songs</Link></li>
                <li><Link to='/profile' >profile</Link></li>
                {role != 'user' && role != null ? <li><Link to='/add_album' >add album</Link></li> : <></>}
                {role != "user" && role != null ? <li><Link to='/add_song' >add song</Link></li> : <></>}
                {role == 'creator' ? <li><Link to='/myalbums'>My albums</Link></li> : <></>}
                {role == "creator" ? <li><Link to='/mysongs'>my songs</Link></li> : <></>}
                {role == "admin" ? <li><Link to='/all_albums' >all albums</Link></li>:<></>}
                {role == "admin" ? <li><Link to='/all_songs' >all song</Link></li>:<></>}
            </ul>
        </nav>
    </header>
    </>
  )
}

export default Navbar