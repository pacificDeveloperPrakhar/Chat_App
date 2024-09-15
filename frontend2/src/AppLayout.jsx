import React from 'react'
import { Outlet } from 'react-router-dom'
import {openNewToast} from "./slices/toastSlice"
import {useDispatch} from "react-redux"
import Snackbar from './components/snackbar'
import ToastManager from './utils/ToastManager';
import NavigationManager from './utils/NavigationManager'
export default function AppLayout() {
  const dispatch=useDispatch()
  return (
    <div id="AppLayout">
        <Outlet/>
        <Snackbar/>
        <ToastManager/>
        <NavigationManager/>
        </div>

  )
}
