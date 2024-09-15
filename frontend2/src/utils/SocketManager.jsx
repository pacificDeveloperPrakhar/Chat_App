import React, { useEffect } from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import socket,{setSocket} from '../socket'
import { usersConnectionModify } from '../slices/userSlice'
export default function SocketManager() {
  const user=useSelector(state=>state.user.user)
  const dispatch=useDispatch()
  useEffect(()=>{
    console.log(!(user&&user.is_verified))
    if(!(user&&user.is_verified))
    {
        console.log("socket will not be connected")
        return
    }
    //    first i will pass the user whole info in form of handshake for the handshake procedure then it will modify the
    //    options object of the socket ,then it will make the connection
        setSocket({user})
        socket.connect()
    //now i will register the necessary events such as the users and conversation events
        // for getting all the conversations
        socket.on("all_conversations_registered",function(conversations){
        })
        // for getting all the users
        socket.on("new_socket_connection",function({users}){
            dispatch(usersConnectionModify(users))
        })

    return ()=>{
        socket.disconnect()
    }
  },[user])
  return (
    <></>
  )
}
