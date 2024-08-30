import { createAsyncThunk, createSlice,current } from "@reduxjs/toolkit";
import axios from "axios";
import {produce,current} from "immer"
const conversationState={
    userIdCurrentlySessioned:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).id:null,
    conversations:[],
    conversation:null,
    error:null,
    isLoading: true,
    isAdding: true,
}
export const restoreConversationsSession=createAsyncThunk("conversations/restoreCoversations",async function (payload,{rejectWithValue,getState,dispatch}) {
    // get all the conversations dtored to the store
    try{

        dispatch(conversationSlice.actions.addConversationsToStore(payload));
        const state=getState();
        const chatsUrl=(conversationId)=>`http://127.0.0.1:3124/conversation/${conversationId}/chats?limit=10&page=1`
        const messagesPayload=[]
        for(let i=0;i<state.conversations.conversations.length;i++){
            try{
            state.conversations.conversations[i].isAdding=true;
            state.conversations.conversations[i].isLoading=true;
            const {data:{data:{messages}}}=await axios.get(chatsUrl(state.conversations.conversations[i].id,state.conversations.conversations.chatLoadCounter))
            messagesPayload.push({id:state.conversations.conversations[i].id,messages})
        }
        catch(err){

            console.log(err)
            messagesPayload.push({id:state.conversations.conversations[i].id,error:rejectWithValue(err)})
        }
    }
    return messagesPayload
}
catch(err){
    console.log(err)
    return rejectWithValue(err)
}
})
const conversationSlice=createSlice({
    name:"conversations",
    initialState:conversationState,
    reducers:{
        addConversationsToStore:(previousState,action)=>{
            let conversations=Array.isArray(action.payload)?[...action.payload]:[action.payload]
            const state={...current(previousState)}
            // before adding the conversation to the redux store i will be removing all the duplicate conversations
            try{
                conversations=conversations.map((conversation)=>{
                    let profileUrls
                    const doesHaveProfileUrl=(conversation?.profileUrl)?true:false;
                    let participantsNames
                    if(!doesHaveProfileUrl){
                        // this field will store the image url of all other users other than user currently sessioned
                        profileUrls=(conversation.participants.filter(({id})=>id!=state.userIdCurrentlySessioned)).map((participant)=>participant?.profileUrl)
                        // this will filter the participant accept the participant itself
                        participantsNames=(conversation.participants.filter(({id})=>id!=state.userIdCurrentlySessioned)).map(participant=>participant?.username)
                    }
                    const isGroup=(conversation?.participants?.length>2)?true:false;
                    return {chatsLength:0,participantsNames,chatRetrieved:false,chatLoadCounter:1,isLoading:false,error:null,isAdding:false,isTyping:null,inChat:null,isGroup,profileUrls,doesHaveProfileUrl,chats:[],error:null,...conversation}
                    
                })
                state.conversations=[...state.conversations,...conversations]
                state.conversations.filter((convo,index,self)=>{
                    return index===self.findIndex((c)=>c.id===convo.id)
                })
            }
            catch(err){
                state.error=JSON.parse(JSON.stringify(err))
                console.log(err)
            }
            finally{
                state.isAdding=false;
                state.isLoading=false;
                state.conversations=state.conversations.filter((convo,index,self)=>{
                    return index===self.findIndex((c)=>c.id==convo.id)
                })
                return state
            }
        },
        newChatReceived: (previousState, action) => {
            const chat = action.payload;
            let conversations=[...current(previousState.conversations)]
            // Find the conversation that matches the chat's conversationId
            let conversation = conversations.find(convo => convo.id === chat.conversationId);
            conversations = [...current(previousState.conversations)].filter(convo => convo.id !== chat.conversationId);
        
            if (conversation) {
                // Update the conversation's chats array by adding the new chat at the beginning
                let chats = [chat, ...conversation.chats];
                let chatsLength=chats.length;
            
                conversation={...conversation,chats,chatsLength}
            }
            conversations=[conversation,...conversations]
            const newState= {
                ...current(previousState),
                conversations
            };
            return (newState)
        }
        
    },
    extraReducers:(builder)=>{
        builder.addCase(restoreConversationsSession.pending,(state)=>{
            state.isLoading=true;
            state.isAdding=true;
        })
        builder.addCase(restoreConversationsSession.rejected,(state,action)=>{
            state.isLoading=false;
            state.isAdding=false;
            state.error=action.payload
        })
        builder.addCase(restoreConversationsSession.fulfilled,(state,action)=>{
            // here i am adding all the chats fetched from the server to the conversation state 
            // and also incrementing the chat load counter by 1
            action.payload.forEach(chats=>{
                const conversation=state.conversations.find(conversation=>conversation.id==chats.id)
                if(chats.error)
                conversation.error=chats.error
                else{
                conversation.chats=chats.messages||[]
                conversation.chatRetrieved=true
                conversation.chatsLength=chats?.messages?.length
                conversation.chatLoadCounter=2}
                conversation.isAdding=false
                conversation.isLoading=false
            })
            state.isLoading=false;
            state.isAdding=false;
        })
    }
})

export const {addConversationsToStore ,newChatReceived} = conversationSlice.actions
export default conversationSlice.reducer