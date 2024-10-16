import React, { useEffect } from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import socket,{setSocket} from '../socket'
import { usersConnectionModify } from '../slices/userSlice'
import { new_conversation_state, new_conversations_registered, state_modify } from '../slices/conversationStateSlice'
import { restoreConversationsSession,newConversationCreated ,newChatReceived,state_modified} from '../slices/conversationSlice'
export default function SocketManager() {
  const user=useSelector(state=>state.user.user)
  const dispatch=useDispatch()
  useEffect(()=>{

    if(!(user&&user.is_verified))
    {
        return
    }
    //    first i will pass the user whole info in form of handshake for the handshake procedure then it will modify the
    //    options object of the socket ,then it will make the connection
        setSocket({user})
        socket.connect()
    //now i will register the necessary events such as the users and conversation events
        // for getting all the conversations
          socket.on("all_conversations_registered",async (conversations_all)=>{
            console.log("all_conversations_reg")
            console.log(conversations_all)
            await dispatch(restoreConversationsSession(conversations_all))
           })
        // for getting all the users
        socket.on("new_socket_connection",async function({users}){
            console.log("new_socket_connection")
            await dispatch(usersConnectionModify(users))
        })

        socket.on("create_conversations",function(payload){
          console.log(payload)
          // whenever the create_conversations event will be triggered this action will be dispatched
          dispatch(new_conversation_state(payload))
          dispatch(newConversationCreated(payload))
        })
        socket.on("chatMessage",(response)=>{
          console.log(response)
         dispatch(newChatReceived(response))
        })
        //  for some reason the modification of the state of conversation is casuing infinite render
        //
        //
       //this piece of code has been commented out
       //
        //  socket.on("state_changed_for_room",(state)=>{
        //  const {mount,action}=state
        //  dispatch(state_modify(state))
        //  })
         //
         //

        // first the chat event will be triggerd in the chat layout input area and that message will be received which will then be /
        // causing the change of state of the entire conversation slice
        // its not the most efficient way but i acknowledge that
        // this logic was not working hence i do be commenting out this code segment and see if i could fix it by doing some modification

        // socket.on("state_changed_for_room",response=>{
        //   dispatch(state_modified(response))
        // })

    return ()=>{
        socket.off("new_socket_connection")
        socket.off("all_conversations_registered")
        socket.off("chatMessage")
        socket.disconnect()

    }
  },[user])
  return (
    <></>
  )
}
