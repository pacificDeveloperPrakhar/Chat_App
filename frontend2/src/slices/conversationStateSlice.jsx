import {createSlice} from "@reduxjs/toolkit"
import {current} from "immer"
const initialState={

}
const conversationStateSlice=createSlice({
    name:"conversation_state",
    initialState,
    reducers:{
        state_modify:()=>{

        }
    }
})

export default conversationStateSlice.reducer
const {state_modify}=conversationStateSlice.actions
export {state_modify}