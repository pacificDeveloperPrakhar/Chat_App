import React, { useCallback, useEffect, useRef, useState } from 'react';
import ChatTile from './ChatTile';
import socket from '../socket';
import Lottie from 'lottie-react';
import LottieFileChat from '../assets/chat_load.json';
import Avatar from './AvatarOnline&Offline';
import { useDispatch, useSelector } from 'react-redux';
import { chatLoadMessages } from "../slices/conversationSlice";

// whenever this component will umount i will cause a state_changed_name event trigger this will be used to 
// create that in chat feature 
export default function ChatsDisplayWithinContainer({ convo, participantUsers, isTyping }) {
  // when component will mount i will trigger the in chat event trigger using socket
  const convo_temp = useSelector((state) => state.conversations.conversations).find(c=>c.id==convo.id);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const chatLayout = useRef(null);
  const handleScroll = useCallback(async () => {
    if (chatLayout.current && chatLayout.current.scrollTop === 0) {
      console.log("scrolled to the top");

      // Trigger the desired event here, such as loading older 
      dispatch(chatLoadMessages({ id: convo_temp.id, chatLoadCounter: convo_temp.chatLoadCounter, chatRetrieved: convo_temp.chatRetrieved }));
      
      // once the chat is scrolled to the top it will enable the hasBeenScrolled which will later used to not allow the automatic 
      // scroll to bottom 
    }
  }, []);

  if (convo_temp) {
    socket.emit('state_changed_for_room', {
      conversationId: convo_temp.id,
      host: user.id,
      action: 'inChat',
      mount: true,
    });
  }

  useEffect(() => {
    if (chatLayout.current) {
      chatLayout.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (chatLayout.current) {
        chatLayout.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [convo_temp]);

  return (
    <div className="absolute inset-0 flex flex-col p-4 chat_window_section_display flex flex-col gap-4" ref={chatLayout}>
      {convo_temp?.chats.map((chat) => {
        if (chat.senderId === user.id) {
          return (
            <ChatTile
              key={chat.id}
              receiver={chat.senderId}
              participantUsers={participantUsers}
              chat={chat}
            />
          );
        }
        if (chat.senderId !== user.id) {
          return (
            <ChatTile
              key={chat.id}
              sender={chat.senderId}
              participantUsers={participantUsers}
              chat={chat}
            />
          );
        }
        return null;
      })}

      {isTyping?.profilePic && (
        <div className="flex items-center gap-2 mt-2">
          <Avatar
            size={18}
            username={isTyping.username}
            src={isTyping?.profilePic}
          />
          <div className="relative">
            <Lottie
              animationData={LottieFileChat}
              loop={true}
              className="lottie-typing"
              style={{
                width: '4rem',
              }}
            />
            <span className="absolute left-0 text-xs text-gray-500">Typing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
