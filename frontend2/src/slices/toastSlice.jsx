import {createSlice} from "@reduxjs/toolkit"
import {current} from "immer"
const initialState={
    toast_count:0,
    toasts:[],
    keyGen:0
}

const toastSlice=createSlice({
    name:"toast",
    initialState,
    reducers:{
       openNewToast:function(state,{payload:{mssg,type}}){
       let theme;
        switch (type) {
            case "info":

              theme = "#42a8e3";
              break;
            case "success":
              
              theme = "#14fc47";
              break;
            case "error":
              
              theme = "#e80c43";
              break;
            case "send":
              
              theme = "#a103fc";
              break;
            case "quest":

                theme="#fc03c6"
                break;
            default:

              theme = "#000000"; 
          }
          state.toasts=[...current(state.toasts),{theme,key:state.keyGen+1,mssg,type}]
          state.keyGen=state.keyGen+1
          state.toast_count=state.toast_count+1
       },
       closeToast:function (state,{payload:{key}}){
          const toasts=[...current(state.toasts)].filter(toast=>{
            return toast.key!=key
          })
          state.toasts=toasts
       }
       
    },
    extraReducers:(builder)=>{}
})

export default toastSlice.reducer
 const {openNewToast,closeToast} =toastSlice.actions
export {openNewToast,closeToast}
