import {createSlice,createAsyncThunk, current} from "@reduxjs/toolkit"
import axios from '../utils/axiosConfigured'
import { axiosInstanceForMultipart } from "../utils/axiosConfigured"
// initially when our app will start it will look for the info
// from the local storage and then it will store that into the redux store
const userState={
    users:[],
    user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{},
    error:null,
    isLoading:false,
    isAdding:false,
    message:null,
}
export const logoutAction=createAsyncThunk("user/logout",async (payload,{rejectWithValue,getState,dispatch})=>{
  try
  {
    const {data:{data:{message}}} = await axios.post(
      "/profiles/logout",
      payload
    );
    console.log(message)
    return message
  }
  catch(err)
  {
    
    if(!err.response)
      return (rejectWithValue( JSON.parse(JSON.stringify(err)),"error was seen"));
      return (rejectWithValue( JSON.parse(JSON.stringify(err.response.data)),"error was seen"));
    
  }
})
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
          "/profiles/signup",
          payload
        );
        return data;
      } catch (err) {
        if(!err.response)
          return (rejectWithValue( JSON.parse(JSON.stringify(err)),"error was seen"));
          return (rejectWithValue( JSON.parse(JSON.stringify(err.response.data)),"error was seen"));
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
            withCredentials:true,
             headers: {
               
               "Content-Type": "application/json",
             },
           };
        const response = await axios.post(
          "/profiles/login",
          payload
        );
        // for now session id is coming from the  payload of response later when
        // when i will be done with the hosting and make it production ready 
        // then i will make sure that the token and sessionID are send it in
        // the header
        const {data}=response
        const {data:{sessionID}}=response
        document.cookie = `connect.sid=${sessionID}; path=/; secure; samesite=strict; max-age=3600`;
        return data;
      } catch (err) {
        console.log(err.response);
        if(!err.response)
        return (rejectWithValue( JSON.parse(JSON.stringify(err)),"error was seen"));
        return (rejectWithValue( JSON.parse(JSON.stringify(err.response.data)),"error was seen"));

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
  export const updatedUserProfilePicture=createAsyncThunk("user/upload_image",async function (payload,{rejectWithValue,getState,dispatch}) {
     const {images}=payload
     const formData=new FormData();
     formData.append("images",images)
     console.log(formData.getAll("images"))
     try{
           // Replace `/api/upload` with your actual API endpoint
           axios.defaults.headers
           const response = await axiosInstanceForMultipart.post("/profiles/updateCurrentlySessionedUser/",formData,{
            headers: {
              'Content-Type':'multipart/form-data',
            }}
           )
           console.log(response.data)
          return response.data
     }
     catch(error){
      // this will not give a very specific error detail because i have not give proper error response on when server fails to
      // handle the error when a different type of file is exported
      console.log(error.response)
      return rejectWithValue(error.response?.data?.message || 'Error uploading image');
     }     
  })
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
          console.log(action.payload)
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
          console.log("users array from the socket has been received ,this suggest a new socket has connected to the server")
        })
        .addCase(usersConnectionModify.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          state.message = 'Failed to update users';
        });
        // these are promises cases handling for the when user uploads the pic this is for user/uploadPicture thunk

        builder.addCase(updatedUserProfilePicture.pending,(state)=>{
          state.isLoading=true;
          state.error=null;
        })
        builder.addCase(updatedUserProfilePicture.fulfilled,(state,action)=>{
          state.isLoading=false
          state.message={mssg:action.payload.message,type:"success",preventUserRender:true};
          state.user.profileUrl=action.payload.data[0].profileUrl;
          localStorage.setItem("user",JSON.stringify(state.user));
        })
        builder.addCase(updatedUserProfilePicture.rejected,(state,action)=>{
          state.isLoading=false
          console.log(action.payload)
          state.error=action.payload
        })
        builder.addCase(logoutAction.rejected,(state,action)=>{
          state.isLoading = false;
          state.error = action.payload;
        })
        builder.addCase(logoutAction.pending,(state,action)=>{
          state.isAdding=true;
          state.isLoading=true;
        })
        builder.addCase(logoutAction.fulfilled,(state,action)=>{
          state.isAdding=false;
          state.isLoading=false;
          state.message={mssg:action.payload,type:"success"};
          state.user={};
        })
    },
  });
  export default userSlice.reducer;
  