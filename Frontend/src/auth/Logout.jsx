import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axiosConfig";
import { successToast, errorToast } from "../config/tostifyConfig";
import { useContext } from "react";
import { playContext } from "../Context/PlaySongContext";

const Logout = () => {
  const navigate = useNavigate();

  const {_,setcurrent} = useContext(playContext);

  const logoutHandler = async () => {
    try {
      const res = await api.post("/auth/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      successToast(res.data.message);
      setcurrent('');
      navigate("/login");
    } catch (error) {
      errorToast(
        error.response?.data?.message || "Logout failed"
      );
    }
  };

  return (
    <button
      className="logout-btn"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
};

export default Logout;