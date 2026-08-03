import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../config/axiosConfig.js'
import { successToast, errorToast } from '../config/tostifyConfig.js'
import './form.css'
const AddAlbum = () => {

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [load, setload] = useState(false)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setload(true);
    if(!name || !image){
      setload(false);
      return errorToast("Fill all the fields.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try{

      const res = await api.post("/albums/create", formData);

      console.log(res.data);
      setName("");
      setImage(null);
      successToast(res.data.message);
      navigate("/myalbums");

    }catch(error){
      errorToast(
        error.response?.data?.message || error.message || "Something went wrong."
      );
    }finally{
      setload(false);
    }

  }

  return (
    <>
    <div className="con">
      <h3>create album</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} id="" placeholder="Album Name"  />
        <div>
                  <label htmlFor="image">Album Image:</label>
                  <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])} id="" placeholder="Album Image"  />
        </div>
        <button type="submit">{load ? "Creating..." : "Create Album"}</button>
      </form>
    </div>
    </>
  )
}

export default AddAlbum