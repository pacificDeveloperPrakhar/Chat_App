import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { usersConnectionModify } from "../slices/userSlice";
import io from "socket.io-client";
import Avatar from '@mui/material/Avatar';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  let socketHeader;

  useEffect(() => {
    socketHeader = io("http://127.0.0.1:1234/%HEADERS%", {
      extraHeaders: {
        "userId": JSON.stringify(user),
      },
      path: "/chat",
    });

    socketHeader.on('new_socket_connection', (message) => {
      dispatch(usersConnectionModify(message));
    });

    return () => {
      socketHeader.off('new_socket_connection');
      socketHeader.disconnect();
    };
  }, [dispatch, user]);

  return (
    <nav
      className="bg-orange-500 shadow-2xl h-full w-64 fixed left-0 top-0 flex flex-col justify-between text-white font-semibold"
      style={{ boxSizing: 'border-box' }}
    >
      <div>
        <div className="h-16 flex items-center justify-center bg-orange-600 w-full shadow-md">
          <h2 className="text-xl">ChatBar</h2>
        </div>
        <ul className="flex flex-col justify-start items-start h-auto w-full px-4 space-y-4 pt-4">
          <li className="hover:bg-orange-600 px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer w-full">
            <Link to="about">About</Link>
          </li>
          <li className="hover:bg-orange-600 px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer w-full">
            <Link to="chat">Chat</Link>
          </li>
          <li className="hover:bg-orange-600 px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer w-full">
            <Link to="form">Sign in</Link>
          </li>
        </ul>
      </div>
      
      <div className="flex items-center justify-start w-full px-4 py-4 space-x-2 bg-orange-600 shadow-inner">
        <Avatar alt={user.username} src={user.profileUrl} />
        <Link to="dashboard">{user.username}</Link>
      </div>
    </nav>
  );
};

export default Header;
