import React,{useEffect, useState} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {Navigate} from "react-router-dom";
function Registration_phase(){
    const [userVerified,setUserVerififed]=useState("not signed")
    const user=useSelector(state=>state.user.user)
    useEffect(()=>{
        if(user&&user.is_verified)
            {
                setUserVerififed("verified")
            }
        else if(!user)
        {
            setUserVerififed("not signed")
        }
        else if(user&&!user.is_verified)
        {
            setUserVerififed("not verified")
        }
    },[user])
  switch(userVerified){
    case "not signed":
        return <Navigate to="/form/" replace  state={userVerified}/>
    case "not verified":
        return <Navigate to="/form/" replace  state={userVerified}/>
    case "verified":
        return <Navigate to="/chat_screen_layout/" replace state={userVerified}/>
    default :
        return <Navigate to="/form/" replace  state={userVerified}/>
  }
}
export default function NavigationManager() {
  return (
    <>
    <Registration_phase/>
    </>
  )
}
