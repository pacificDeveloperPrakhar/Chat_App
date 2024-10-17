import {createSlice} from "@reduxjs/toolkit"
import {current} from "immer"
const initialState={

}
const conversationStateSlice=createSlice({
    name:"conversation_state",
    initialState,
    reducers:{
        state_modify:(previousState,{payload})=>{
            const { action, mount, host, conversationId } = payload;

            if (!previousState[conversationId]) return previousState;
            
            if (action === "isTyping") {
              if (mount) {
                // Add host to the isTyping array
                return {
                  ...previousState,
                  [conversationId]: {
                    ...previousState[conversationId],
                    isTyping: [...new Set([...previousState[conversationId].isTyping, host])], // this is to make there is no duplicate host and also to keep it serializable 
                    // set is converted back to the object primitive that is whose prototype is null
                  },
                };
              } else {
                // Remove host from the isTyping array
                return {
                  ...previousState,
                  [conversationId]: {
                    ...previousState[conversationId],
                    isTyping: previousState[conversationId].isTyping.filter(
                      (typingHost) => typingHost !== host
                    ),
                  },
                };
              }
            }
            
            if (action === "inChat") {
              if (mount) {
                // Add host to the inChat array
                return {
                  ...previousState,
                  [conversationId]: {
                    ...previousState[conversationId],
                    inChat: [...new Set([...previousState[conversationId].inChat, host])], // Avoid duplicating the host
                  },
                };
              } else {
                // Remove host from the inChat array
                return {
                  ...previousState,
                  [conversationId]: {
                    ...previousState[conversationId],
                    inChat: previousState[conversationId].inChat.filter(
                      (chatHost) => chatHost !== host
                    ),
                  },
                };
              }
            }
            
            return previousState;
            
        },
        new_conversation_state:function(previousState,action){
            // extract the id of the conversation from the payload
            const {id,chats}=action.payload
            if(current(previousState)[id])
                return{id:{
            unread:0,
            usernames:[],
            state:null,
            iconChatUrl:[],
            isTyping:[],
            inChat:[],
            chatsLength:chats.length,
            chatLoadCounter:1

        }}

        },
        new_conversations_registered:function(previousState,action)
        {
            const conversations=action.payload
            const state={}
            const convos=conversations.map(convo => {
                const convo_template={
                    id:convo.id,
                    unread:0,
            usernames:[],
            state:null,
            iconChatUrl:[],
            isTyping:[],
            inChat:[],
            unread:0,
            chatsLength:convo.chats.length,
            chatLoadCounter:1
                }
                return convo_template
            });
            // now convert the array of conversation states to object with key as the conversaiton index
            convos.forEach( convo=> {
                state[convo.id]=convo
            });
            return state
        }
    }
})

export default conversationStateSlice.reducer
const {state_modify,new_conversation_state,new_conversations_registered}=conversationStateSlice.actions
export {state_modify,new_conversation_state,new_conversations_registered}