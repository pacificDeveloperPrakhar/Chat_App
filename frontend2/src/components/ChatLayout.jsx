import React from 'react';
import { BsChatLeftDots } from 'react-icons/bs';
import { IoIosSettings } from 'react-icons/io';
import { IoIosChatboxes } from "react-icons/io";
import Avatar from"./AvatarOnline&Offline"
import Contact_Section from './Contact_Section';
export default function ChatLayout() {
  return (
    <div className='ChatLayout flex h-full'>
      <div className="header  flex flex-col " style={{
        height: "inherit", 
        flexGrow: 0, 
        padding:"0.5rem"
      }}>
         <div className="section_header flex flex-col flex-auto justify-start gap-3">
         <button className='header_button' style={{
        }}>
          <IoIosChatboxes className='text-4xl'  />
        </button>
         </div>
         <div className="section_header flex flex-col flex-auto justify-end gap-4">
         <button className='header_button' style={{
          height: "2.6rem", width: "2.6rem", padding: "0.5rem" 
        }}>
          <IoIosSettings className='text-4xl' />
        </button>
        
          <Avatar online={false}/>
         </div>

      </div>
      <Contact_Section/>
      <div className="chatContainer " style={{ backgroundColor: '#f0f0f0',flexGrow:6 }}>
      </div>
    </div>
  );
}
