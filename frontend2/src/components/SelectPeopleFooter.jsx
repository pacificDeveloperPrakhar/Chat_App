import React, { useEffect, useState } from 'react'
import { MdOutlineGroupAdd } from "react-icons/md";
import { RiChatNewFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
export default function SelectPeopleFooter() {
    const [isGroup,setIsGroup]=useState(false)
    const selectedUsers=useSelector(state=>state.utils.selectedUsers)
    useEffect(()=>{
      console.log(isGroup)
      console.log(selectedUsers)
    if(selectedUsers.length>1)
      setIsGroup(true)
    else{
      setIsGroup(false)
    }
    },[selectedUsers])
  return (
    <>
    {
      selectedUsers.length?<div className='text-white w-full bg-slate-500 flex justify-evenly'>
    <span>{isGroup?<MdOutlineGroupAdd />:<RiChatNewFill/> }</span>
    <span className='text-xl '>{isGroup?`create a new group`:`start chatting with`}</span>
    </div>:<></>
  }
  </>
  )
}
