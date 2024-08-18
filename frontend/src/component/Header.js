import { Link } from 'react-router-dom';
import React ,{useEffect}from 'react';
import { useDispatch,useSelector } from "react-redux";
import { addUserAction, loginUserAction ,usersConnectionModify} from "../slices/userSlice";
import io from "socket.io-client";
import Avatar from '@mui/material/Avatar';
const Header = () => {
const dispatch=useDispatch()
const user=useSelector(state=>state.user.user)
let socketHeader

useEffect(() => {
  // Establish the socket connection
    socketHeader = io("http://127.0.0.1:1234/%HEADERS%", {
    extraHeaders: {
      "userId": JSON.stringify(user),
    },
    path: "/chat",
  });

  // Listen for the 'new_socket_connected' event
  socketHeader.on('new_socket_connected', (message) => {
    // Dispatch the action with the received message
    dispatch(usersConnectionModify(message));
  });

  // Cleanup the socket connection on component unmount
  return () => {
    socketHeader.off('new_socket_connected');
    socketHeader.disconnect();
  };
}, []);

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
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" >
        <li className="">
          <Link to="dashboard">name</Link>
        </li>
        </Avatar>
      </ul>
    </nav>
  );
};

export default Header;
