import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import api from '../config/axiosConfig';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { errorToast,successToast } from '../config/tostifyConfig';
import './home.css'
import { useContext } from 'react';
import { playContext } from '../Context/PlaySongContext';

const Home = () => {

  const [data, setdata] = useState([]);
  const [page, setpage] = useState(1);

  const [likes, setlikes] = useState([]);

  const {_,setcurrent} = useContext(playContext);
  

async function likeToggle(songId) {
    try {
        const res = await api.get(`/like/${songId}`);
        console.log(res.data);
        successToast("Song liked successfully");
        return res.data;
        setlikes((prevLikes) => {
          if (prevLikes.includes(songId)) {
            // If the song is already liked, remove it from the likes array
            return prevLikes.filter((id) => id !== songId);
          } else {
            // If the song is not liked, add it to the likes array
            return [...prevLikes, songId];
          }
        });
  }
    catch (error) {
    console.log(error);
    errorToast(
      error.response?.data?.message || 
      error.message || 
      "Something went wrong"
    );
  }
}


  useEffect(() => {
  const fetchLikes = async () => {
    try {
      const res = await api.get("/auth/profile");
      setlikes(res.data.user.likes || []);
    } catch (error) {
      console.log(error);
    }
  };

  fetchLikes();
}, [likes]);

  useEffect(() => {

    const fetchData = async () => {

      try{
        const res = await api.get(`/songs/all?page=${page}&limit=10`);
        setdata( (prev) =>{
                    const merged = [...prev, ...res.data.songs];


          const uniqueSongs = merged.filter(
            (song, index, self) =>
              index === self.findIndex((a) => a._id === song._id)
          );

          return uniqueSongs;
        });
        
        console.log(page);
      }catch(error){
        console.log(error);
      }

    }

    fetchData();

  }, [page]);
  
  useEffect(() => {
      const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight) {
          setpage(prevPage => prevPage + 1);
        }
      };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
    <div className="song-con">
      <h2>all Songs</h2>
      <div className="songs">
        {data && data?.map((song)=>{
          return (
            <div className="song" onClick={()=>{
              setcurrent(song._id);
            }} key={song._id}>
              <img src={song.img} alt="" />
              <div className="like-icon" onClick={(e) =>{
                e.stopPropagation();
                likeToggle(song._id)}}>
                {likes.some((id) => id === song._id) ? (
                  <FaHeart/>
                ) : (
                  <FaRegHeart />
                )}
              </div>
              <h4>{song.name}</h4>
            </div>
          )
        })}
      </div>
    </div>
    </>
  )
}

export default Home