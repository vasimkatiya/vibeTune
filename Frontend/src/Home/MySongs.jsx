import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import api from '../config/axiosConfig';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { errorToast,successToast } from '../config/tostifyConfig';
import './home.css';
import { useNavigate } from "react-router-dom";
import {MdDelete} from 'react-icons/md'

const MySongs = () => {

  const [data, setdata] = useState([]);
  const [page, setpage] = useState(1);

  const [likes, setlikes] = useState([]);

  const navigate = useNavigate();

const handleDelete = async (id) => {
  try {
    const res = await api.delete(`/songs/${id}`);

    setdata((prev) => prev.filter((song) => song._id !== id));

    successToast(res.data.message);
  } catch (error) {
    console.log(error);
    errorToast(error.response?.data?.message || "Something went wrong");
  }
};

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
        const res = await api.get(`/songs/upload/all?page=${page}&limit=10`);
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
      <h2>My Songs</h2>
      <div className="songs">
        {data && data?.map((song)=>{
          return (
            <div className="song" key={song._id}>
              <img src={song.img} alt="" />
              <div className="like-icon" onClick={() => likeToggle(song._id)}>
                {likes.some((id) => id === song._id) ? (
                  <FaHeart/>
                ) : (
                  <FaRegHeart />
                )}
              </div>
              <h4>{song.name}</h4>
              <button className="delete" onClick={(e)=>{
                e.stopPropagation();
                handleDelete(song._id)
              }} ><MdDelete /></button>
            </div>
          )
        })}
      </div>
    </div>
    </>
  )
}

export default MySongs