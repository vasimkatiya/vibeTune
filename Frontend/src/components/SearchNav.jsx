import React,{useContext, useState} from 'react'
import { IoSearch } from "react-icons/io5";
import api from '../config/axiosConfig';
import { searchContext } from '../Context/SearchContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../CompStyle/searchnav.css'

const SearchNav = () => {
  const [query, setQuery] = useState('');

  const {_, setSearchResults} = useContext(searchContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await api.get(`/songs/query?query=${query}`);
    setSearchResults(res.data);
    console.log(res.data);

    navigate('/search');

  };

  return (
    <div className='searchNav'>
        <form onSubmit={handleSubmit} className="search-form">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} name="query" placeholder="Search..." required />
            <button type="submit"><IoSearch /></button>
        </form>
    </div>
  )
}

export default SearchNav