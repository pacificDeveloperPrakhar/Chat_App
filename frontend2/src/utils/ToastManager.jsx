import React, { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {openNewToast} from "../slices/toastSlice"
import checkUserVerificability from './checkUserVerificability';

function RegistrationError(){
    const dispatch=useDispatch()
    const error=useSelector(state=>state.user.error)
    
    useEffect(()=>{
       if(error){
           const {message}=error
           dispatch(openNewToast({mssg:`${message}`,type:"error"}))
       }
    },[error])
}
// this react fragment will be used to display toast to the user regarding successfull logina and signin
function RegistrationSuccess(){
  const dispatch=useDispatch()
  const user=useSelector(state=>state.user.user)
  useEffect(()=>{
    
  if(!Object.values(user).length)
  {
    dispatch(openNewToast({mssg:"sign in to proceed",type:"info"}))
    return
  }
  const info=checkUserVerificability(user)
  dispatch(openNewToast(info))
  },[user]
)
return <>
</>
}
// this fragment will lookout for message state change
function Dispatch_Toast_When_The_Message_State_In_User_Changes(){
  const dispatch=useDispatch()
  const message=useSelector(state=>state.user.message)
  useEffect(()=>{
    if(message){
      console.log(message)
      dispatch(openNewToast(message))
    }
  },[message])
  return <>
  </>
}
// this fragment will contain all the smaller empty fragments that will be subsribed to specific type of error filed in the state and slo those field which needs to be 
// displayed in form of toast to user
export default function (){ 
  return (
    <React.Fragment>
        <RegistrationError/>
        <RegistrationSuccess/>
        <Dispatch_Toast_When_The_Message_State_In_User_Changes/>
    </React.Fragment>
  )
}
