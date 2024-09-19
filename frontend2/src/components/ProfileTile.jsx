import React from 'react';
import { motion } from 'framer-motion';
import { AiOutlineDown } from "react-icons/ai";

import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import JavascriptTimeAgo from "javascript-time-ago";
import Avatar  from './AvatarOnline&Offline';
import en from 'javascript-time-ago/locale/en';

// Add locale for English
JavascriptTimeAgo.addLocale(en);

// Create a time formatter
const minutesAgo = new JavascriptTimeAgo('en');
export default function ConversationItem({  selected_user ,user}) {
 
const userInfo={
    last_seen:minutesAgo.format(new Date(349000000)),
    profileUrl:user.profileUrl,
    name:user.username,
    online:user.userStatus=="active"?true:false
}

  return (
    <>
        <motion.div
          className={`conversation absolute z-10 ${selected_user === user ? 'bg-blue-100' : ''}`}
          layoutId={`conversation-${user}`}
          initial={{
            opacity:0
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 70, 
            damping: 15,   
            mass: 1,       
            ease: 'easeInOut', 
            duration: 0.2 
          }}
        >
          <div className="avatar_section justify-center items-center py-5 px-2">
            <Avatar src={userInfo.profileUrl} username={userInfo.name} online={userInfo.online}/>
          </div>

          <div className="content self-stretch flex-auto flex-col items-stretch">
            <div className="time_block flex-auto text-end">
              <span className="time-span">{`last seen : ${userInfo.last_seen}`}</span>
            </div>

            <div className="chat_content h-1/2 flex flex-col justify-end items-start px-5 ">
              <span className='self-stretch flex' style={{
                transform:"translateX(1rem)"
              }}>
              <span className='self-stretch' style={{
                fontSize:"1.1rem"
              }}>{userInfo.name}</span>
              </span>
              <div className="messageAndMore flex items-center">
                <AiOutlineDown className="icon-bottom-right" />
              </div>
            </div>
          </div>
        </motion.div>

      {selected_user.includes(user) && (
        <motion.div
          className="selected_convo"
          initial={false}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: -1 }}
        />
      )}
    </>
  );
}
