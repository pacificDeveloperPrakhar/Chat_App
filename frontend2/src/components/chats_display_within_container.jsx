import React from 'react';
import ChatTile from './ChatTIle';
import { useSelector } from 'react-redux';
export default function ChatsDisplayWithinContainer({ convo,participantUsers}) {
    const user=useSelector(state=>state.user.user)
  return (
    <div className="inset-0 absolute flex flex-col  p-4 chat_window_section_display">
      {/* Chat Container */}
      <div className="chat flex flex-col gap-4">
       {convo.chats.map((chat)=>{
        if(chat.senderId==user.id)
        return <ChatTile receiver={chat.senderId} participantUsers={participantUsers} chat={chat}></ChatTile>
        if(chat.senderId!=user.id)
        return <ChatTile sender={chat.senderId} participantUsers={participantUsers} chat={chat}/>
        })}
      </div>
    </div>
  );
}
