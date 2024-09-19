import { createSlice } from "@reduxjs/toolkit";
const initialState={
    openNewChatNav:false
}
const uitlSlices=createSlice({
    name:"utils",
    initialState,
    reducers:{
        toggleNewChatNav:function(state,{payload}){
            state.openNewChatNav=!state.openNewChatNav
        }
    }
})
export default uitlSlices.reducer
export const {toggleNewChatNav}=uitlSlices.actions
