import React, { useState } from "react";
import api from "../config/axiosConfig";
import { errorToast } from "../config/tostifyConfig.js";
import { Link, Navigate, useNavigate } from "react-router-dom";


const Signup = ({ setrole }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [load, setload] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setload(true);
      if (!name || !email || !password || !role) {
        return errorToast("Fill all the fields.");
      }

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      console.log(res.data);

      localStorage.setItem('role',res.data.newUser.role);
      setrole(localStorage.getItem('role'));

      setName("");
      setEmail("");
      setPassword("");
      setRole("");

      navigate('/login');

      setload(false)

    } catch (error) {
      errorToast(
        error.response?.data?.message || error.message || "Something went wrong."
      );
    }finally{
        setload(false)
    }
  };

  return (
    <div className="form-container">
      <div className="form-text">
        <p>Set your vibe tuned with signup in VibeTune.</p>
        <p>Your music assistant.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="user">User</option>
          <option value="creator">Creator</option>
        </select>

        <button type="submit">{load ? 'loading' : 'Sign Up'}</button>
      </form>
      <p>
      if you already have an account ? <Link className="auth-nav" to="/login" >login</Link>
      </p>
    </div>
  );
};

export default Signup;