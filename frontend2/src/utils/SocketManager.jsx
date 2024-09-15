import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import socket from '../socket'
export default function SocketManager() {
  const user=useSelector(state=>state.user.user)
  useEffect(()=>{
    if(user&&user.is_verified)
        socket.connect()
    return ()=>{
        socket.disconnect()
    }
  },[user])
  return (
    <></>
  )
}
