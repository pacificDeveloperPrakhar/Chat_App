import React from 'react';
import { Outlet,Link } from 'react-router-dom';
import { IoIosSettings } from 'react-icons/io';
import { IoIosChatboxes } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Avatar from"./AvatarOnline&Offline"
import SocketManager from '../utils/SocketManager';
import { useDispatch,useSelector } from 'react-redux';
import { logoutAction } from '../slices/userSlice';
export default function ChatLayout() {
  const {profileUrl,username}=useSelector(state=>state.user.user)
  const dispatch=useDispatch()
  function logoutHandler(){
    // first delete the user key value pair from the localStorage from the browser
    const user=JSON.parse(localStorage.getItem("user"))
    if(!user)
      return 
    localStorage.removeItem("user")
    //here i will dispatch an action that will hit the route that will cause the deletion of the session document from the server mongodb 
    dispatch(logoutAction())
  }
  return (
    <>
    <div className='ChatLayout flex h-full'>
      <div className="header  flex flex-col " style={{
        height: "inherit", 
        flexGrow: 0, 
        padding:"0.5rem"
      }}>
         <div className="section_header flex flex-col flex-auto justify-start gap-3">
         <button className='header_button' style={{
        }}>
          <Link to="" className='nav-link'>
          <IoIosChatboxes className='text-4xl'  />
          </Link>
        </button>
         </div>
         <div className="section_header flex flex-col flex-auto justify-end gap-4">
         <button className='header_button' style={{
          height: "2.6rem", width: "2.6rem", padding: "0.5rem" 
        }}>
          <Link to="setting" className='nav-link'>
          <IoIosSettings className='text-4xl' />
          </Link>
        </button>
        <span className='header_button' style={{
          height: "2.6rem", width: "2.6rem", padding: "0.5rem" 
        }} onClick={logoutHandler}>
        <RiLogoutBoxRLine />
        </span>
        <Link to="me" className='nav-link'>
          <Avatar online={false} src={profileUrl} username={username}/>
        </Link>
         </div>

      </div>
      

    <Outlet/>
    </div>
    <SocketManager/>
</>
  );
}
