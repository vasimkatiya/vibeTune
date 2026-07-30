import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RefreshHandler = ({setisAuth}) => {

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{

        if(localStorage.getItem("token")){
            setisAuth(true)
            if(location.pathname == "/" || location.pathname == "/login" || location.pathname == "/signup")
            {
                navigate("/home",{replace:false});
            }
        }

    },[location,navigate,setisAuth])

  return (
    null
  )
}

export default RefreshHandler