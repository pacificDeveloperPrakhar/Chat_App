import React, { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {openNewToast} from "../slices/toastSlice"

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
  console.log(user)
  useEffect(()=>{
  dispatch(openNewToast({mssg:user,type:"success"}))
  },[user]
)
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
    </React.Fragment>
  )
}
