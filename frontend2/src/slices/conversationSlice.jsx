import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../utils/axiosConfigured"
import { produce, current } from "immer";

const conversationState = {
  userIdCurrentlySessioned: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).id
    : null,
  conversations: [],
  conversation: null,
  error: null,
  isLoading: true,
  isAdding: true,
};
export const restoreConversationsSession = createAsyncThunk(
  "conversations/restoreCoversations",
  async function (payload, { rejectWithValue, getState, dispatch }) {
    try {
      dispatch(conversationSlice.actions.addConversationsToStore(payload));
      const state = getState();
      const chatsUrl = (conversationId) =>`/conversation/${conversationId}/chats?limit=13&page=1`;
      // prakhar:this code of communication slice is the same one that i did use in the previous frontend project
      const messagesPayload = [];

      for (let i = 0; i < state.conversations.conversations.length; i++) {
        try {
          // setting these isAdding and isLoading within the conversations filed within conversations slice
          //THAT is uselesss
          //as getState does not return a draft!!!!!!
          // state.conversations.conversations[i]={...current(state.conversations.conversations[i]),isAdding:true}
          // state.conversations.conversations[i].isLoading = true;
          const {
            data: {
              data: { messages },
            },
          } = await axios.get(
            chatsUrl(
              state.conversations.conversations[i].id,
              state.conversations.conversations.chatLoadCounter
            )
          );
          messagesPayload.push({
            id: state.conversations.conversations[i].id,
            messages,
          });
        } catch (err) {
          console.log(err);
          messagesPayload.push({
            id: state.conversations.conversations[i].id,
            error: rejectWithValue(err),
          });
        }
      }
      return messagesPayload;
    } catch (err) {
      console.log(err);
      if(err.response)
      return rejectWithValue(err.response);
      return rejectWithValue(err)
    }
  }
);
export const chatLoadMessages=createAsyncThunk("conversations/chatLoadOnScroll",async function(payload,{rejectWithValue,getState,dispatch}){
  console.log("counter 0")
  const {id,chatLoadCounter,chatRetrieved}=payload
  const chatsUrl = (conversationId,loadCounter) =>
    `/conversation/${conversationId}/chats?limit=13&page=${loadCounter}`;
  try{
  
    const {
      data: {
        data: { messages },
      },
    } =await axios.get(chatsUrl(id,chatLoadCounter))
    console.log(messages)
    return {chatsRetrieved:messages,id}
  }
  catch(err){
    console.log(err)
    return rejectWithValue({error:err,id})
  }
  
  })

const conversationSlice = createSlice({
  name: "conversations",
  initialState: conversationState,
  reducers: {
    addConversationsToStore: (previousState, action) => {
      let conversations = Array.isArray(action.payload)
        ? [...action.payload]
        : [action.payload];
      const state = { ...current(previousState) };

      try {
        conversations = conversations.map((conversation) => {
          let profileUrls;
          const doesHaveProfileUrl = conversation?.profileUrl ? true : false;
          let participantsNames;

          if (!doesHaveProfileUrl) {
            profileUrls = conversation.participants
              .filter(({ id }) => id != state.userIdCurrentlySessioned)
              .map((participant) => participant?.profileUrl);
            participantsNames = conversation.participants
              .filter(({ id }) => id != state.userIdCurrentlySessioned)
              .map((participant) => participant?.username);
          }

          const isGroup = conversation?.participants?.length > 2 ? true : false;
          return {
            chatsLength: 0,
            participantsNames,
            chatRetrieved: false,
            chatLoadCounter: 1,
            isLoading: false,
            error: null,
            isAdding: false,
            isTyping: null,
            inChat: null,
            isGroup,
            profileUrls,
            doesHaveProfileUrl,
            chats: [],
            error: null,
            ...conversation,
          };
        });

        state.conversations = [...state.conversations, ...conversations];
        state.conversations.filter((convo, index, self) => {
          return index === self.findIndex((c) => c.id === convo.id);
        });
      } catch (err) {
        state.error = JSON.parse(JSON.stringify(err));
        console.log(err);
      } finally {
        state.isAdding = false;
        state.isLoading = false;
        state.conversations = state.conversations.filter(
          (convo, index, self) => {
            return index === self.findIndex((c) => c.id == convo.id);
          }
        );
        return state;
      }
    },
    newChatReceived: (previousState, action) => {
      const chat = action.payload;
      let conversations = [...current(previousState.conversations)];
      let conversation = conversations.find(
        (convo) => convo.id === chat.conversationId
      );
      conversations = [...current(previousState.conversations)].filter(
        (convo) => convo.id !== chat.conversationId
      );

      if (conversation) {
        let chats = [...conversation.chats, chat];
        let chatsLength = chats.length;

        conversation = { ...conversation, chats, chatsLength };
      }
      
      conversations = [conversation, ...conversations];
      const newState = {
        ...current(previousState),
        conversations,
      };
      return newState;
    },
    //when someone initiate a new conversation or start a new conversation
    newConversationCreated:function(previousState,action){
       const convo=action.payload
       const state=current(previousState)
       let conversations=[...current(previousState.conversations)]
       let conversation=conversations.find((convo)=>convo.id==newConvo.id)
       if(conversation)
        { console.log("new conversation does already exists")
          return
        }
        //------------------------------------------------------
        let profileUrls;
          const doesHaveProfileUrl = convo?.profileUrl ? true : false;
          let participantsNames;

          if (!doesHaveProfileUrl) {
            profileUrls = convo.participants
              .filter(({ id }) => id != state.userIdCurrentlySessioned)
              .map((participant) => participant?.profileUrl);
            participantsNames = convo.participants
              .filter(({ id }) => id != state.userIdCurrentlySessioned)
              .map((participant) => participant?.username);
          }

          const isGroup = convo?.participants?.length > 2 ? true : false;
           conversation= {
            chatsLength: 0,
            participantsNames,
            chatRetrieved: false,
            chatLoadCounter: 1,
            isLoading: false,
            error: null,
            isAdding: false,
            isTyping: null,
            inChat: null,
            isGroup,
            profileUrls,
            doesHaveProfileUrl,
            chats: [],
            error: null,
            ...convo,
          };
        // -----------------------------------------------------
      conversations=[conversation,...conversations]
      return {
        ...current(previousState),
        conversations
      }
    }
    
  },
  extraReducers: (builder) => {
    builder.addCase(restoreConversationsSession.pending, (state) => {
      state.isLoading = true;
      state.isAdding = true;
    });
    builder.addCase(restoreConversationsSession.rejected, (state, action) => {
      state.isLoading = false;
      state.isAdding = false;
      state.error = action.payload;
    });
    builder.addCase(restoreConversationsSession.fulfilled, (state, action) => {
      action.payload.forEach((chats) => {
        const conversation = state.conversations.find(
          (conversation) => conversation.id == chats.id
        );
        if (chats.error) conversation.error = chats.error;
        else {
          conversation.chats = chats.messages || [];
          conversation.chatRetrieved = true;
          conversation.chatsLength = chats?.messages?.length;
          conversation.chatLoadCounter = 2;
        }
        conversation.isAdding = false;
        conversation.isLoading = false;
      });
      state.isLoading = false;
      state.isAdding = false;
    });
    builder.addCase(chatLoadMessages.rejected,(state,action)=>{ 
      console.log(action.payload)
      console.log(action)
       const conversation=state.conversations.find(convo=>convo.id==action.payload.id);
       conversation.error=action.payload.error;
       conversation.chatRetrieved=false;
       conversation.isAdding=false
       conversation.isLoading=false

    })
    builder.addCase(chatLoadMessages.pending,(state)=>{
      state.isAdding=true;
      state.isLoading=true;

    })
    builder.addCase(chatLoadMessages.fulfilled,(state,action)=>{
      const {chatsRetrieved}=action.payload
      if(!chatsRetrieved.length)
        return
      chatsRetrieved.sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt))
      const conversation=state.conversations.find(convo=>convo.id==action.payload.id);
      conversation.isAdding=false;
      conversation.isLoading=false;
      conversation.chatRetrieved=true;
      conversation.chats=[...current(conversation.chats),...chatsRetrieved]
      conversation.chatsLength=conversation.chatsLength+chatsRetrieved.length
      conversation.chatLoadCounter=conversation.chatLoadCounter+1;

    })
  },
});

export const { addConversationsToStore, newChatReceived ,newConversationCreated} =
  conversationSlice.actions;
export default conversationSlice.reducer;
