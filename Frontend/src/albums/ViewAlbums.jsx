import React, { useEffect, useState } from "react";
import api from "../config/axiosConfig";
import { useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { errorToast, successToast } from "../config/tostifyConfig";
import './view.css'

const ViewAlbums = () => {
  const [likes, setLikes] = useState([]);
  const [data, setData] = useState(null);

  const { id } = useParams();


 
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await api.get("/auth/profile");
        setLikes(res.data.user.likes || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLikes();
  }, []);


  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await api.get(`/albums/${id}`);
        setData(res.data.album);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchAlbum();
    }

  }, [id]);


  const likeToggle = async (songId) => {
    try {
      const res = await api.get(`/like/${songId}`);

      setLikes((prevLikes) => {
        const alreadyLiked = prevLikes.some(
          (id) => id.toString() === songId.toString()
        );

        if (alreadyLiked) {
          return prevLikes.filter(
            (id) => id.toString() !== songId.toString()
          );
        }

        return [...prevLikes, songId];
      });

      successToast(res.data.message || "Updated like");

    } catch (error) {
      console.log(error);

      errorToast(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  };


  return (
    <div className="container">

      <div className="upper">

        <div className="img">
          <img
            src={data?.img}
            alt={data?.name}
          />
        </div>


        <div className="info">
          <h2>{data?.name}</h2>

          <p>
            by {data?.user_id?.name}
          </p>

        </div>

      </div>


      <div className="songs">

        {data?.songs?.map((song) => (

          <div
            className="song"
            key={song._id}
          >

            <img
              src={song.img}
              alt={song.name}
            />


<h4>
  {song.name}
</h4>
            <div
              className="like-icon"
              onClick={() => likeToggle(song._id)}
            >

              {likes.some(
                (id) =>
                  id.toString() === song._id.toString()
              ) ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}

            </div>




          </div>

        ))}

      </div>

    </div>
  );
};

export default ViewAlbums;