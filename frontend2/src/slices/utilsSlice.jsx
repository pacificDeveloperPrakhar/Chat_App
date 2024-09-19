import { createSlice } from "@reduxjs/toolkit";
const initialState={
    openNewChatNav:false,
    selectedUsers:[]
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
        }
    }
})
export default uitlSlices.reducer
export const {toggleNewChatNav,setSelectedUsers}=uitlSlices.actions
