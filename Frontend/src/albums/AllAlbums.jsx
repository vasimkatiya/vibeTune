import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import api from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { errorToast, successToast } from '../config/tostifyConfig';

const AllAlbums = () => {

  const [data, setdata] = useState([]);
  const [page, setpage] = useState(1);

  const navigate = useNavigate();


const handleDelete = async (id) => {
  try {
    const res = await api.delete(`/albums/${id}`);

    setdata((prev) => prev.filter((song) => song._id !== id));

    successToast(res.data.message);
  } catch (error) {
    console.log(error);
    errorToast(error.response?.data?.message || "Something went wrong");
  }
};

  useEffect(() => {

    const fetchData = async () => {

      try {
        const res = await api.get(`/albums/all?page=${page}&limit=10`);
        setdata((prev) => {
          const merged = [...prev, ...res.data.albums];

          const uniqueAlbums = merged.filter(
            (album, index, self) =>
              index === self.findIndex((a) => a._id === album._id)
          );

          return uniqueAlbums;
        });
        console.log(page);
      } catch (error) {
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
      <div className="album-con">
        <h2>All Albums</h2>
        <div className="albums">
          {data && data?.map((album, i) => {
            return (
              <div className="album" onClick={() => navigate(`/albums/${album._id}`)} key={i}>
                <img src={album.img} alt="" />
                <h4>{album.name}</h4>
                <button className='delete'  onClick={(e) => {
                  e.stopPropagation();
    handleDelete(album._id);
  }}><MdDelete /></button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default AllAlbums