import React, { useEffect, useState } from "react";
import { errorToast } from "../config/tostifyConfig";
import api from "../config/axiosConfig";
import img from "../assets/pro.png";
import Logout from "../auth/Logout";
import "./profile.css"

const Profile = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/auth/profile");

        setData(res.data);
        console.log(res.data);

      } catch (error) {
        console.log("Full error:", error);

        errorToast(
          error.response?.data?.message || 
          error.message || 
          "Something went wrong"
        );
      }
    };

    fetchData();
  }, []);

  return (
    <div className="profile">
      {data && (
        <>
        <div className="up">
          <img src={img} alt="Profile" />
        </div>
        <div className="down">
          <h2>{data.user.name}</h2>
          <p>{data.user.email}</p>
          <p>{data.user.role}</p>
          <Logout />
        </div>
        </>
      )}
    </div>
  );
};

export default Profile;