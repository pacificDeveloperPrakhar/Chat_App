import { configureStore } from "@reduxjs/toolkit";
import user from "../slices/userSlice";
import toast from "../slices/toastSlice"
import conversations from "../slices/conversationSlice";
const store=configureStore({
    reducer:{
       user,
       toast,
       conversations
    }
})
export default store