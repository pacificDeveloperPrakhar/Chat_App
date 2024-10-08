import React from 'react';
import { ImAttachment } from "react-icons/im";
import { GrSend } from "react-icons/gr";
import { useSelector } from 'react-redux';
import EmptyPreviewSlot  from './EmptyPreviewSlot';"./EmptyPreviewSlot"
import AvatarGroup  from './AvatarGroup.jsx';
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { MdOutlineVideoCall } from "react-icons/md";
import { MdAddCall } from "react-icons/md";
import { filterConversationDetails } from '../utils/filterConversationItem';
import  ChatDisplay from "./chats_display_within_container.jsx"
<PiDotsThreeOutlineVerticalLight />

export default function ChatContainer() {
  const conversation=useSelector(state=>state.utils.selectConversation)
  const users=useSelector(state=>state.user.users)
  let participantUsers
  // when the conversation has been selected i will proceed toward the process of selecting the users from the users state in the redux
// store and then from there i will render the users
  if(conversation)
    // this is to select only those users whose id matches with the participant users id in the conversation
  // some funtion on the array is used when u want to perform only on the random some among the array
    participantUsers = users.filter(user => 
      conversation.participants.some(participantUsers => participantUsers.id === user.id)
    );
    
  conversation&&console.log(participantUsers)
  let toBeRendered=null
  if(conversation)
  toBeRendered=filterConversationDetails(conversation,participantUsers)
  console.log(toBeRendered)
  if(!toBeRendered)
  return (
<>
<EmptyPreviewSlot/ >
</>)
  return (
    <div className=' absolute inset-0 flex flex-col chat'>
      <header className="chat_header bg-green-500 p-4 flex items-center justify-between shadow-md">
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
      </header>
      
      <div className="chat_screen flex-grow relative bg-transparent p-4 overflow-y-auto">
        <ChatDisplay convo={conversation} participantUsers={participantUsers}></ChatDisplay>
      </div>
      
      <div className="chat_text_input flex items-center px-4 py-2 space-x-3">
        <ImAttachment className="chat_icons attach" />
        <input
          type="text"
          className="flex-grow  rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-950 text-white"
          placeholder="Type a message..."
        />
        <GrSend className="chat_icons" />
      </div>
    </div>
  );
}
