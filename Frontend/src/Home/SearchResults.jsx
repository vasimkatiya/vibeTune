import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react';
import { searchContext } from '../Context/SearchContext.jsx';
import api from '../config/axiosConfig';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { errorToast,successToast } from '../config/tostifyConfig';


const SearchResults = () => {

  const [data, setdata] = useState([]);

  const [likes, setlikes] = useState([]);

const { searchResults } = useContext(searchContext);
  

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

  return (
    <>
    <div className="song-con">
      <h2>Search Results</h2>
      <div className="songs">
        {searchResults.songs && searchResults.songs?.map((song)=>{
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
            </div>
          )
        })}
      </div>
    </div>
    </>
  )
}

export default SearchResults;