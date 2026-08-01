import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios.config";
import { successToast, errorToast } from "../config/toast.config";

const Logout = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await api.post("/auth/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      successToast(res.data.message);

      navigate("/");
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