import React, { useState ,useEffect} from 'react'
import api from '../config/axiosConfig';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { errorToast,successToast } from '../config/tostifyConfig.js';
import '../Home/home.css'

const Likes = () => {

  const [data, setdata] = useState([]);
  const [load, setload] = useState(false);

  
  const [likes, setlikes] = useState([]);


  

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
        setload(true);
        const res = await api.get(`/like/all`);
        setdata(res.data.likes);
      }
      catch(error){
        console.log(error);
      }
      finally{
        setload(false);
      }
    }

    fetchData();


  }, [])
  

  return (
    <>
    <div className="song-con">
      <h2>Liked Songs</h2>
      <div className="songs">
        {load ? (
          <p>Loading...</p>
        ) : data && data?.map((song)=>{
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

export default Likes