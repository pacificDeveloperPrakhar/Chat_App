import { createAsyncThunk, createSlice,current } from "@reduxjs/toolkit";
import axios from "axios";
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
    dispatch(conversationSlice.actions.addConversationsToStore);
    const state=getState();
    const chatsUrl=(conversationId,chatLoadCounter)=>`http://127.0.0.1:3124/conversation/${conversationId}/chats?limit=10&page=0`
    const messagesPayload=[]

    for(let i=0;i<state.conversations.length;i++){
        try{

            const {data:{messages}}=await axios.get(chatsUrl(state.conversations[i].id,state.conversations.chatLoadCounter))
            messagesPayload.push({id:state.conversations[i].id,messages})
        }
        catch(err){
            messagesPayload.push({id:state.conversations[i].id,error:rejectWithValue(err)})
        }
    }
return messagesPayload
})
const conversationSlice=createSlice({
    name:"conversations",
    initialState:conversationState,
    reducers:{
        addConversationsToStore:(state,action)=>{
            console.log(action.payload)
            let conversations=Array.isArray(action.payload)?[...action.payload]:[action.payload]
            // before adding the conversation to the redux store i will be removing all the duplicate conversations
            try{
                conversations=conversations.map((conversation)=>{
                    let profileUrls
                    const doesHaveProfileUrl=(conversation?.profileUrl)?true:false;
                    if(!doesHaveProfileUrl){
                        // this field will store the image url of all other users other than user currently sessioned
                        profileUrls=(conversation.participants.filter(({id})=>id!=state.userIdCurrentlySessioned)).map((participant)=>participant?.profileUrl)
                    }
                    const isGroup=(conversation?.participants?.length>2)?true:false;
                    return {chatRetrieved:false,chatLoadCounter:0,isLoading:false,error:null,isAdding:false,isTyping:null,inChat:null,isGroup,profileUrls,doesHaveProfileUrl,chats:[],error:null,...conversation}
                    
                })
                state.conversations.push(...conversations)
            }
            catch(err){
              state.error=JSON.parse(JSON.stringify(err))
              console.log(err)
            }
            finally{
                state.isAdding=false,
                state.isLoading=false
            }
            state.conversations.filter((convo,index,self)=>{
                return index===self.findIndex((c)=>c.id==convo.id)
            })
        }
    },
    extraReducers:(builder)=>{}
})

export const {addConversationsToStore} = conversationSlice.actions
export default conversationSlice.reducer