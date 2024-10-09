import React, { useEffect } from 'react';
import ChatTile from './ChatTIle';
import socket from "../socket"
import { useSelector } from 'react-redux';
// whenever this component wil umount i will cause a state_changed_name event trigger this will be used to 
// create that in chat feature 
export default function ChatsDisplayWithinContainer({ convo,participantUsers}) {
  // when component will mount i will trigger the in chat event trigger using socket
    const convo_temp=useSelector(state=>state.conversations.conversations.find(c=>c.id==convo.id))
    const user=useSelector(state=>state.user.user)
    if(convo_temp)
    socket.emit("state_changed_for_room",{
      conversationId:convo_temp.id,
      host:user.id,
      action:"inChat",
      mount:true
    })
    useEffect(()=>{
      return ()=>{

        if(convo_temp)
          socket.emit("state_changed_for_room",{
            conversationId:convo_temp.id,
            host:user.id,
            action:"inChat",
            event:false
          })
      }
    })
  return (
    <div className="inset-0 absolute flex flex-col  p-4 chat_window_section_display">
      {/* Chat Container */}
      <div className="chat flex flex-col gap-4">
       {convo_temp.chats.map((chat)=>{
        if(chat.senderId==user.id)
        return <ChatTile receiver={chat.senderId} participantUsers={participantUsers} chat={chat}></ChatTile>
        if(chat.senderId!=user.id)
        return <ChatTile sender={chat.senderId} participantUsers={participantUsers} chat={chat}/>
        })}
      </div>
    </div>
  );
}
