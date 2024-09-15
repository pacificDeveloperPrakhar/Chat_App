import React, { useEffect ,useState} from 'react'
import Avatar from "./AvatarOnline&Offline";
import { MdOutlineArrowUpward } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoCloudDoneOutline } from "react-icons/io5";
import { set } from 'mongoose';
export default function Me () {
  const user=useSelector(state=>state.user.user)
  const users=useSelector(state=>state.user.users)
  useEffect(()=>{
    if(!user?.profileUrl)
      return
    console.log(user.profileUrl)

  },[user])
  return (
    <div className="bg-white flex-1 flex h-full justify-center items-center">
      <div className="me flex-col relative">
       <div className="profile_picture_view  rounded-full relative">
          <Avatar size={190} src={user?.profileUrl} username={user?.username}/>
          <span className='upload absolute  p-3 ' style={{
            fontSize:"3rem"
          }}>{!user?.profileUrl?<MdOutlineArrowUpward />:<IoCloudDoneOutline />}</span>
       </div>
       .
      </div>
    </div>
  )
}
