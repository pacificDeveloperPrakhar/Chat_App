import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { disconnect } from "process";
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
// this is to modify our users whenever there is a new connection of socket or disconnection
export const usersConnectionModify = createAsyncThunk(
  'user/modify',
  async (payload, { rejectWithValue }) => {
    try {
      // Check if the payload is an array of users
      if (Array.isArray(payload)) {
        // Simulate async operation using Promise.resolve
        return Promise.resolve(payload);
      } else {
        // If the payload is not an array, simulate an error
        return Promise.reject('Payload is not an array of users');
      }
    } catch (error) {
      // Handle and return the error using rejectWithValue for proper error handling
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: userState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAdding = true;
      })
      .addCase(addUserAction.fulfilled, (state, action) => {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        state.isAdding = false;
        state.isLoading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(addUserAction.rejected, (state, action) => {
        state.isAdding = false;
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAdding = true;
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        localStorage.setItem('user', JSON.stringify(action.payload.data.profile));
        state.isAdding = false;
        state.isLoading = false;
        state.user = action.payload.data.profile;
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.isLoading = false;
        state.isAdding = false;
        state.error = action.payload;
      })
      .addCase(usersConnectionModify.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(usersConnectionModify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload; // Only modifying the `users` array
        state.error = null;
        state.message = 'Users updated successfully';
      })
      .addCase(usersConnectionModify.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.message = 'Failed to update users';
      });
  },
});
export default userSlice.reducer;
