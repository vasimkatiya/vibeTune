import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CompStyle/navbar.css";

import { MdLibraryMusic, MdMenu, MdClose } from "react-icons/md";
import { FaMusic, FaHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const Navbar = ({ role, setrole }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setrole(localStorage.getItem("role"));
  }, []);

  return (
    <header>
      <div className="logo">
        <h2>VibeTune</h2>
      </div>
      <button
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <MdClose /> : <MdMenu />}
      </button>

      <nav className={menuOpen ? "nav active" : "nav"}>
        <ul onClick={() => setMenuOpen(false)}>
          <li><Link to="/home" className="link"><FaMusic /> Songs</Link></li>

          <li><Link to="/albums" className="link"><MdLibraryMusic /> Albums</Link></li>

          <li><Link to="/likes" className="link"><FaHeart /> Likes</Link></li>

          <li><Link to="/profile" className="link"><CgProfile /> Profile</Link></li>

          {role !== "user" && role && (
            <li><Link to="/add_album" className="link">Add Album</Link></li>
          )}

          {role !== "user" && role && (
            <li><Link to="/add_song" className="link">Add Song</Link></li>
          )}

          {role === "creator" && (
            <>
              <li><Link to="/myalbums" className="link">My Albums</Link></li>
              <li><Link to="/mysongs" className="link">My Songs</Link></li>
            </>
          )}

          {role === "admin" && (
            <>
              <li><Link to="/all_albums" className="link">All Albums</Link></li>
              <li><Link to="/all_songs" className="link">All Songs</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;