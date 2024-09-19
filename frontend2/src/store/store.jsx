import { configureStore } from "@reduxjs/toolkit";
import user from "../slices/userSlice";
import toast from "../slices/toastSlice"
import conversations from "../slices/conversationSlice";
import utils from "../slices/utilsSlice";
const store=configureStore({
    reducer:{
       user,
       toast,
       conversations,
       utils
    }
})
export default store