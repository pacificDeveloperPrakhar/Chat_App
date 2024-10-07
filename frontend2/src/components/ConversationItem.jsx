import React from 'react';
import { motion } from 'framer-motion';
import { AiOutlineDown } from "react-icons/ai";

import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import JavascriptTimeAgo from "javascript-time-ago";
import  AvatarGroup  from './AvatarGroup';
import en from 'javascript-time-ago/locale/en';

// Add locale for English
JavascriptTimeAgo.addLocale(en);

// Create a time formatter
const minutesAgo = new JavascriptTimeAgo('en');
export default function ConversationItem({ convo, selected_convo ,users}) {
  const unreadMessages = 4;
  const participantsUsers = users.filter((user) => convo.participantsId.includes(user.id));
  // this function will be used to filter all the fields that are requried to displau on the conversation item
  function filterConversationDetails(convo){
    const isGroup=convo.isGroup;
    const usernames=convo.participantsNames
    // const tileName=isGroup?`${usernames[0]} and ${usernames.length}+`:`${username[0]}`
    const tileName=usernames[0]
    const lastChat={}
    let chat_last=convo.chats[convo.chats.length - 1]
    if(chat_last)
    {
      lastChat.content=chat_last.text?<span>{chat_last.text}</span>:<i>shared a file</i>
      lastChat.sender=participantsUsers.find((user)=>user.id==chat_last.senderId).username
    }
    else
    {
      lastChat.content=<i>start chatting</i>
      lastChat.new=true
    }

    const timespan=!chat_last?minutesAgo.format(Date.now()):minutesAgo.format(new Date(chat_last.sendAt));

    const profileImage=convo.profileUrls[0]
    return{
      tileName,isGroup,lastChat,timespan,profileImage,usernames
    }
  }
  const toBeRendered=filterConversationDetails(convo)
  return (
    <>
      {!toBeRendered.isGroup&& (
        <motion.div
          className={`conversation absolute z-10 ${selected_convo === convo.conversation ? 'bg-blue-100' : ''}`}
          layoutId={`conversation-${convo.conversation}`}
          initial={{
            opacity:0
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 70, // Lower stiffness for smoother motion
            damping: 15,   // Higher damping to avoid "bouncy" motion
            mass: 1,       // Affects how "heavily" the element moves
            ease: 'easeInOut', // Smooth ease-in-out curve
            duration: 0.2  // Control the overall speed of the animation
          }}
        >
          <div className="avatar_section justify-center items-center py-5 px-2">
            <AvatarGroup users={participantsUsers} toberendered={toBeRendered} />
          </div>

          <div className="content self-stretch flex-auto flex-col items-stretch">
            <div className="time_block flex-auto text-end">
              <span className="time-span">{toBeRendered.timespan}</span>
              <div className="unread_messages flex justify-end pr-5 absolute right-5 -bottom-0 -z-10">
                {unreadMessages > 0 && (
                  <Badge badgeContent={unreadMessages} color="secondary">
                    <MailIcon />
                  </Badge>
                )}
              </div>
            </div>

            <div className="chat_content h-1/2 flex flex-col justify-end items-start px-5 ">
              <span className='flex flex-col'>
              <span className='' style={{
                fontSize:"1.1rem"
              }}>{toBeRendered.tileName}</span>
              <span className='text-sm ' style={{
                fontSize:"0.8rem"
              }}>{!toBeRendered.lastChat.new 
                ? (
                    <>
                      <span>{toBeRendered.lastChat.sender} : </span>
                      {toBeRendered.lastChat.content}
                    </>
                  ) 
                : toBeRendered.lastChat.content}</span>
              </span>
              <div className="messageAndMore flex items-center">
                <AiOutlineDown className="icon-bottom-right" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {selected_convo?.id === convo.id && (
        <motion.div
          className="selected_convo"
          layoutId="selected"
          initial={false}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: -1 }}
        />
      )}
    </>
  );
}
