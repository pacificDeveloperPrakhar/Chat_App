import React from 'react';
import { motion } from 'framer-motion';
import { AiOutlineDown } from "react-icons/ai";
import Avatar from "./AvatarOnline&Offline";
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';

export default function ConversationItem({ convo, selected_convo, unreadMessages }) {
  return (
    <>
      <motion.div
        className={`conversation absolute z-10 ${selected_convo === convo.conversation ? 'bg-blue-100' : ''}`}
        layoutId={`conversation-${convo.conversation}`}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <div className="avatar_section justify-center items-center py-5 px-2">
          <Avatar online={false} />
        </div>

        <div className="content self-stretch flex-auto flex-col items-stretch">
          <div className="time_block flex-auto text-end">
            <span className="time-span">12:30</span>
            <div className="unread_messages flex justify-end pr-5 absolute right-5 -bottom-0 -z-10">
            {unreadMessages > 0 && (
              <Badge badgeContent={unreadMessages} color="secondary">
                <MailIcon />
              </Badge>
            )}
          </div>
          </div>

          <div className="chat_content h-1/2 flex flex-col justify-end items-start px-5">
            <span>john: this is the text</span>
            <div className="messageAndMore flex items-center">
              <AiOutlineDown className="icon-bottom-right" />
            </div>
            
          </div>
          
        </div>
      </motion.div>

      {selected_convo === convo.conversation && (
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
