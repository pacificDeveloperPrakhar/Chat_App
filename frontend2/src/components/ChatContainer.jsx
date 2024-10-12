import React, { useEffect, useState } from 'react';
import { ImAttachment } from "react-icons/im";
import { GrSend } from "react-icons/gr";
import { useSelector } from 'react-redux';
import EmptyPreviewSlot  from './EmptyPreviewSlot';"./EmptyPreviewSlot"
import AvatarGroup  from './AvatarGroup.jsx';
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { MdOutlineVideoCall } from "react-icons/md";
import { MdAddCall } from "react-icons/md";
import { filterConversationDetails } from '../utils/filterConversationItem';
import  ChatDisplay from "./chats_display_within_container.jsx";
import socket from "../socket.jsx"
<PiDotsThreeOutlineVerticalLight />

export default function ChatContainer() {
  const [message,setMessage]=useState("")
  const conversation=useSelector(state=>state.utils.selectConversation)
  //this code logic did failed
  //{
    //this conversation_state will be used along with the users object to render the typing or in chat text 
  //telling who is typing such as john@123 is typing if there are two or more than two 
  // implementing just for the is typing right now
  //
  //
  //1--first checking if the person has done selecting the conversation which he wants to chat
//}
  const [isTyping,setIsTyping]=useState(null)
  const users=useSelector(state=>state.user.users)
  const user=useSelector(state=>state.user.user)
  let participantUsers
  // when the conversation has been selected i will proceed toward the process of selecting the users from the users state in the redux
// store and then from there i will render the users
  if(conversation)
    // this is to select only those users whose id matches with the participant users id in the conversation
  // some funtion on the array is used when u want to perform only on the random some among the array
    participantUsers = users.filter(user => 
      conversation.participants.some(participantUsers => participantUsers.id === user.id)
    );
  
  let toBeRendered=null
  if(conversation)
  toBeRendered=filterConversationDetails(conversation,participantUsers)
  useEffect(()=>{
    // first: the client will listen for any emit from the server to this socket
    // second: conversationId,action,username,mount will be destructured from the object that is incomming from the server
    //third:after that if the action is saying isTyping and the mount is true
    //fourth:then ChatContainer component's isTyping state set it to the username whose state has been send the latest
    //fifth:if the mount is otherwise then set the isTyping to false
    //do the same for the inChat as well
    socket.on("state_changed_for_room",(state)=>{
      console.log(state)
      const {conversationId,action,mount,username,profilePic}=state
      if(conversationId!=conversation.id)
        return
      switch(action){
        case "isTyping":
          if(mount){
            setIsTyping({username,profilePic})
          }
          else
          {
            setIsTyping(null)
          }
      }
    })
   return ()=>{
    socket.off("state_changed_for_room")
   }
  })
  if(!toBeRendered)
  return (
<>
<EmptyPreviewSlot/ >
</>)
  return (
    <div className=' absolute inset-0 flex flex-col chat'>
      <header className="chat_header bg-green-500 p-4 flex items-center justify-between shadow-md relative">
        <div className="profile flex space-x-6 items-center">
        <div className="avatar " style={{
            height:"3rem",
            width:"3rem",
        }}>
        <AvatarGroup toberendered={toBeRendered} size={60} users={participantUsers}/>

        </div>
        <h2 className="text-white text-lg font-semibold">{toBeRendered.tileName}</h2>

        </div>
        <div className="profile_options flex  space-x-6">
        <MdOutlineVideoCall className='chat_icons'/>
        <MdAddCall className='chat_icons'/>
        <PiDotsThreeOutlineVerticalLight className='chat_icons'/>
        </div>
        {isTyping?.username&&<span className='text-green-500 absolute ' style={{
          top:"3.2rem",
          left:"6rem"
        }}>{`${isTyping.username} is typing`}</span>}
      </header>
      
      <div className="chat_screen flex-grow relative bg-transparent p-4 overflow-y-auto">
        <ChatDisplay convo={conversation} participantUsers={participantUsers} isTyping={isTyping}></ChatDisplay>
      </div>
      
      <div className="chat_text_input flex items-center px-4 py-2 space-x-3 prakhar_app">
        <ImAttachment className="chat_icons attach" />
        <input
          type="text"
          className="flex-grow  rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-950 text-white"
          placeholder="Type a message..."
          onChange={(e)=>setMessage(e.target.value)}
        />
        <span onClick={()=>{
           socket.emit("chatMessage", { text: message, userId: user.id, conversationId: conversation.id })
        }}>
        <GrSend className="chat_icons" />
        </span>
      </div>
    </div>
  );
}