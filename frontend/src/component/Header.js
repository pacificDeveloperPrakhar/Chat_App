import { Link } from 'react-router-dom';
import React ,{useEffect}from 'react';
import { useDispatch } from "react-redux";
import { addUserAction, loginUserAction } from "../slices/userSlice";
const Header = () => {
const dispatch=useDispatch()
useEffect(()=>{
  // this is to ensure that the users profile gets updated each time the app restarts
  if(localStorage.getItem("user"))
  dispatch(loginUserAction({...JSON.parse(localStorage.getItem("user"))}))
},[])
  return (
    <nav className="h-1/6 bg-orange-500 shadow-lg box-content py-4 overflow-hidden">
      <ul className="flex justify-around items-center h-full text-white font-semibold">
        <li className="hover:bg-orange-600 px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer">
          <Link to="about">About</Link>
        </li>
        <li className="hover:bg-orange-600 px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer border-b-orange-700 hover:border-b-2">
          <Link to="chat">Chat</Link>
        </li>
        <li className="hover:bg-orange-600 px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer">
          <Link to="form">Sign in</Link>
        </li>
        <li className="hover:bg-orange-600 px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer">
          <Link to="dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
