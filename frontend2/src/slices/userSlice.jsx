import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"
// initially when our app will start it will look for the info
// from the local storage and then it will store that into the redux store
const userState={
    users:[],
    user:localStorage.getItem("user")?JSON.parse(localStorage.get("user")):{},
    error:null,
    isLoading:false,
    isAdding:false,
    message:null,
}
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
          "http://127.0.0.1:3124/profiles/signup",
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
          "http://127.0.0.1:3124/profiles/login",
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
    // check if the incomming users info is an array
        if (Array.isArray(payload)) {
          return Promise.resolve(payload);
        } else {

          return Promise.reject('Payload is not an array of users');
        }
      } catch (error) {
        
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
          console.log(action)
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
          state.users = action.payload; 
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
  