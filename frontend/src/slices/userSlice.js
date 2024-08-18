import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const userState = {
  users: [],
  user: localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : {},
  error: null,
  isLoading: false,
  isAdding: false,
  message:null
};

export const addUserAction = createAsyncThunk(
  "user/add",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload)
    try {


         const config = {
           headers: {
             
             "Content-Type": "application/json",
           },
         };
      const { data } = await axios.post(
        "http://127.0.0.1:1234/profiles/signup",
        payload,config
      );
      return data;
    } catch (err) {
      console.log(JSON.parse(JSON.stringify(err)));
      return (rejectWithValue( JSON.parse(JSON.stringify(err)),"error was seen"));
    }
  }
);

//for the login this async thunk will be excecuted
export const loginUserAction = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload)
    try {


         const config = {
           headers: {
             
             "Content-Type": "application/json",
           },
         };
      const { data } = await axios.post(
        "http://127.0.0.1:1234/profiles/login",
        payload,config
      );
      console.log(data)
      return data;
    } catch (err) {
      console.log(JSON.parse(JSON.stringify(err)));
      return (rejectWithValue( JSON.parse(JSON.stringify(err)),"error was seen"));
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: userState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addUserAction.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.isAdding = true;
    });
    builder.addCase(addUserAction.fulfilled, (state, action) => {
      localStorage.setItem("user",JSON.stringify(action.payload.user))
      state.isAdding = false;
      state.isLoading = false;
      state.user = action.payload.user;
      state.message=action.payload.message;
    });
    builder.addCase(addUserAction.rejected, (state, action) => { 
      
      state.isAdding = false;
      state.error = action.payload
    });
    builder.addCase(loginUserAction.pending,(state, action) => {
      state.isLoading = true;
      state.error = null;
      state.isAdding = true;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => { 

      state.isLoading = false;
      state.isAdding = false;
      state.error = action.payload
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      localStorage.setItem("user",JSON.stringify(action.payload.data.profile))
      state.isAdding = false;
      state.isLoading = false;
      state.user= action.payload.data.profile
    });
  },
});
export default userSlice.reducer;
