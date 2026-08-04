import React, { useState } from "react";
import api from "../config/axiosConfig";
import { errorToast } from "../config/tostifyConfig.js";
import { Link, useNavigate } from "react-router-dom";
import './form.css'
import { useEffect } from "react";

const Login = ({setrole}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [load, setload] = useState(false)

  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    setload(true);

    try {
      if (!email || !password) {
        return errorToast("Fill all the fields.");
      }

      const res = await api.post("/auth/login", {
        email,
        password,
      });


      localStorage.setItem("token",res.data.token);
      localStorage.setItem('role',res.data.user.role);
      setrole(localStorage.getItem('role'));

      setEmail("");
      setPassword("");

      setload(false)
      navigate('/home');

    } catch (error) {
      errorToast(
        error.response?.data?.message || error.message || "Something went wrong."
      );
    }finally{
        setload(false);
        console.log(load)
    }
  };

  return (
    <div className="form-container">
      <div className="form-text">
        <h3>welcome , again !</h3>
      </div>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">{load ? 'loading':'login'}</button>
      </form>
      <p>
      if you don't have an account ? <Link className="auth-nav" to='/signup' >signup</Link>
      </p>
    </div>
  );
};

export default Login;