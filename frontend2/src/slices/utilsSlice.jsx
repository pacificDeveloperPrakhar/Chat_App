import { selectClasses } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
const initialState={
    openNewChatNav:false,
    selectedUsers:[],
    selectConversation:null
}
const uitlSlices=createSlice({
    name:"utils",
    initialState,
    reducers:{
        toggleNewChatNav:function(state,{payload}){
            state.openNewChatNav=!state.openNewChatNav
        },
        setSelectedUsers:function(state,{payload}){
            state.selectedUsers=payload
        },
        setSelectedConversation:function(state,{payload}){
            state.selectConversation=payload
        }
    }
})
export default uitlSlices.reducer
export const {toggleNewChatNav,setSelectedUsers,setSelectedConversation}=uitlSlices.actions
