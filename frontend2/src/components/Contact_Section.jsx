import React from 'react';
import { AiOutlineDown } from "react-icons/ai";
import Avatar from"./AvatarOnline&Offline"
import ChatTab from './Chat_Tab';
import { RiInboxArchiveLine } from "react-icons/ri";
export default function Contact_Section() {
  return (
    <div className="contact_section flex-auto flex flex-col ">
        <ChatTab/>    <div className="Archived_Bar">
      <RiInboxArchiveLine className="archive-icon" />
      <span className="archive-text">This archived message</span>
    </div>
        
        <ul>
            {[{conversation:1},{conversation:2},{conversation:3},{conversation:4}].map((convo)=>{
                return <li className=''>
                    <div className="conversation">
                    <span className="time-span">12:30 PM</span>
                    <AiOutlineDown className='icon-bottom-right'/>
                    <div className="chat_message">
  <div className="chat_bubble">
    <span className="message">{'john:hey how are you doing'}</span>
  </div>
</div>
  <Avatar className="avatar" online={false} />
                   
                    </div>
                </li>
            })}
        </ul>
    </div>
  )
}
