import React from 'react'
import { useState,useEffect } from 'react';
import api from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AddSong = () => {

  const [songName, setSongName] = useState('');
  const [albumId, setalbumId] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [load, setload] = useState(false)
  const [albums, setalbums] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!songName || !audioFile || !imageFile) {
      alert('Please fill all the fields.');
      setload(false);
      return;
    }

    setload(true);

    const formData = new FormData();
    formData.append('name', songName);
    formData.append('album_id', albumId);
    formData.append('audio', audioFile);
    formData.append('image', imageFile);

    try {
      const res = await api.post('/songs/create', formData);
      console.log(res.data);

      navigate('/home')

    } catch (error) {
      console.error('Error uploading song:', error);
    }
    setload(false);
  }

  useEffect(()=>{
    const fetchAlbums = async () => {
      const res = await api.get('/albums/upload/all?page=1&limit=100');
      setalbums(res.data.albums);
    }
    fetchAlbums();

  },[])



  return (
    <div className="con">
      <h2>Add Song</h2>
      <form action="" onSubmit={handleSubmit}>
   
          <input type="text" name='name' value={songName} onChange={(e) => setSongName(e.target.value)} placeholder='Song Name' />
    
        <select name="album_id" value={albumId} onChange={(e) => setalbumId(e.target.value)}>
          <option value="">Select Album</option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.name}
            </option>
          ))}
        </select>
        <div>
          <label htmlFor="audio">Upload Audio:</label>
        <input type="file" name='audio' onChange={(e) => setAudioFile(e.target.files[0])} />
        </div>
        <div>
          <label htmlFor="image">Upload Image:</label>
          <input type="file" name='image' onChange={(e) => setImageFile(e.target.files[0])} />
        </div>
        <button type='submit' disabled={load}>
          {load ? 'Adding...' : 'Add Song'}
        </button>
      </form>
    </div>
  )
}

export default AddSong