import React from 'react'
import Avatar from './AvatarOnline&Offline';
import { FaRegFileAlt } from "react-icons/fa";
import formatTime,{formatTimeAgo} from '../utils/timeFormatter';

export default function ChatTile({sender,receiver,participantUsers,chat}) {
    const profileImg=participantUsers.find((u)=>participantUsers.some((user)=>user.id==sender||user.id==receiver)).profileUrl
    console.log(profileImg)

    if(receiver)
  return (
    <div className="flex justify-end items-end gap-2">
    <span className="text-xs text-white">{formatTimeAgo(chat.sendAt)}</span>
    <div className="bg-purple-500 text-white p-3 rounded-lg max-w-xs">
    {
            chat.file?<span className='flex space-x-2'><i className='  text-sm'>file has been shared </i> <FaRegFileAlt /></span>:<span>{chat.text}</span>
          }
    </div>
    <Avatar
      size={18}
      username={"nom"}
      src={
        profileImg
      }
    />
  </div>
  )
 if(sender)
    return(       <div className="flex justify-start items-end gap-2">
        <Avatar
          online={false}
          size={18}
          username={"Dummy"}
          src={
            profileImg
          }
        />
        <div className="bg-gray-200 text-black p-3 rounded-lg max-w-xs">
        {
            chat.file?<span className='flex space-x-2'><i className='  text-sm'>file has been shared </i> <FaRegFileAlt /></span>:<span>{chat.text}</span>
          }
        </div>
        <span className="text-xs text-white">{formatTimeAgo(chat.sendAt)}</span>
      </div>)
    return <></>
}
