import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const conversationState={
    conversations:[],
    error:null,
    error: null,
    isLoading: true,
    isAdding: true,
}
const conversationSlice=createSlice({
    name:"conversations",
    initialState:conversationState,
    reducers:{},
    extraReducers:(builder)=>{}
})