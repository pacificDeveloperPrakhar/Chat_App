import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";
import  conversations  from '../slices/conversationSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    conversations
  }
});

export default store;
