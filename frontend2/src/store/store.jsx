import { configureStore } from "@reduxjs/toolkit";
import user from "../slices/userSlice";
import toast from "../slices/toastSlice"
const store=configureStore({
    reducer:{
       user,
       toast

    }
})
export default store