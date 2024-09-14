import React from 'react'
import { Outlet } from 'react-router-dom'
import {openNewToast} from "./slices/toastSlice"
import {useDispatch} from "react-redux"
import Snackbar from './components/snackbar'
export default function AppLayout() {
  const dispatch=useDispatch()
  return (
    <div id="AppLayout">
        <Outlet/>
        <Snackbar/>
        </div>

  )
}
