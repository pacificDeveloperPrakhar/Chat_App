import { useSelector } from 'react-redux';
import {Outlet,Navigate} from 'react-router-dom'
export default function ProtectedRoute(){
    const user=useSelector(state=>state.user.user)
    const isAllowed=(user.is_verified)
    return isAllowed?<Outlet/>:<Navigate to='/form'/>
}