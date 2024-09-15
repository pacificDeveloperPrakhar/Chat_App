import React from 'react';
import { Outlet,Link } from 'react-router-dom';
import { IoIosSettings } from 'react-icons/io';
import { IoIosChatboxes } from "react-icons/io";
import Avatar from"./AvatarOnline&Offline"
import SocketManager from '../utils/SocketManager';
export default function ChatLayout() {
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
        <Link to="me" className='nav-link'>
          <Avatar online={false}/>
        </Link>
         </div>

      </div>
      

    <Outlet/>
    </div>
    <SocketManager/>
</>
  );
}
