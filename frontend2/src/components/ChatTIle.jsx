import React from 'react'
import Avatar from './AvatarOnline&Offline';

export default function ChatTile({sender,receiver}) {
    if(receiver)
  return (
    <div className="flex justify-end items-end gap-2">
    <span className="text-xs text-white">10:46 AM</span>
    <div className="bg-purple-500 text-white p-3 rounded-lg max-w-xs">
      <p>This is a message from the sender.</p>
    </div>
    <Avatar
      size={18}
      username={"You"}
      src={
        "https://res.cloudinary.com/dcbyetumq/image/upload/v1726682088/profiles/your-profile.webp"
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
            "https://res.cloudinary.com/dcbyetumq/image/upload/v1726682088/profiles/tspzdbih10opfnsngpi1.webp"
          }
        />
        <div className="bg-gray-200 text-black p-3 rounded-lg max-w-xs">
          <p>This is a message from the receiver.</p>
        </div>
        <span className="text-xs text-white">10:45 AM</span>
      </div>)
    return <></>
}
