import React, { useEffect } from 'react';
import ChatTile from './ChatTile';
import socket from '../socket';
import Lottie from 'lottie-react';
import LottieFileChat from '../assets/chat_load.json';
import Avatar from './AvatarOnline&Offline';
import { useSelector } from 'react-redux';

// whenever this component will umount i will cause a state_changed_name event trigger this will be used to 
// create that in chat feature 
export default function ChatsDisplayWithinContainer({ convo, participantUsers, isTyping }) {
  console.log(isTyping)
  // when component will mount i will trigger the in chat event trigger using socket
  const convo_temp = useSelector((state) => state.conversations.conversations.find((c) => c.id === convo.id));
  const user = useSelector((state) => state.user.user);

  if (convo_temp) {
    socket.emit('state_changed_for_room', {
      conversationId: convo_temp.id,
      host: user.id,
      action: 'inChat',
      mount: true,
    });
  }

  useEffect(() => {
    return () => {
      
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col p-4 chat_window_section_display">
      <div className="chat flex flex-col gap-4 overflow-y-auto">
        {convo_temp.chats.map((chat) => {
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
      </div>
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
