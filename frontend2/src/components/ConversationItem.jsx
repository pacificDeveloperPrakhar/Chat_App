import React from 'react';
import { motion } from 'framer-motion';
import { AiOutlineDown } from "react-icons/ai";
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import AvatarGroup from './AvatarGroup';

import { filterConversationDetails } from '../utils/filterConversationItem';



export default function ConversationItem({ convo, selected_convo, users }) {
  const unreadMessages = 4;
  const participantsUsers = users.filter((user) => convo.participantsId.includes(user.id));
  
  const toBeRendered = filterConversationDetails(convo,participantsUsers);
  return (
    <>
      {toBeRendered && (
        <div
          className={`conversation absolute z-10 ${selected_convo === convo.conversation ? 'bg-blue-100' : ''}`}
          layoutId={`conversation-${convo.conversation}`}
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

            <div className="chat_content h-1/2 flex flex-col justify-end items-start px-5">
              <span className='flex flex-col'>
                <span className='' style={{
                  fontSize: toBeRendered.isGroup ? "1rem" : "1.1rem",  
                  color: toBeRendered.isGroup ? "white" : "inherit", 
                }}>
                  {toBeRendered.tileName}
                </span>
                <span className='text-sm' style={{
                  fontSize: "0.8rem",
                  color: toBeRendered.isGroup ? "#white" : "inherit",
                }}>
                  {!toBeRendered.lastChat.new ? (
                    <>
                      <span>{toBeRendered.lastChat.sender} : </span>
                      {toBeRendered.lastChat.content}
                    </>
                  ) : toBeRendered.lastChat.content}
                </span>
              </span>
              <div className="messageAndMore flex items-center">
                <AiOutlineDown className="icon-bottom-right" />
              </div>
            </div>
          </div>
        </div>
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

