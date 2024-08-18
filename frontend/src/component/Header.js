import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { usersConnectionModify } from "../slices/userSlice";
import io from "socket.io-client";
import Avatar from '@mui/material/Avatar';
import { MdInfo, MdChat, MdLogin, MdAccountCircle } from 'react-icons/md';
import Tooltip from '@mui/material/Tooltip';

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
      className="bg-orange-500 shadow-lg h-full fixed left-0 top-0 flex flex-col justify-between text-white font-semibold"
      style={{ 
        boxSizing: 'border-box',
        boxShadow: '4px 0 8px rgba(0, 0, 0, 0.3)' // Shadow on the right side
      }}
    >
      <div className="h-16 flex items-center justify-center bg-orange-600 w-full shadow-md">
        {/* No title or name here */}
      </div>
      <ul className="flex flex-col justify-start items-start h-full w-full px-2 space-y-4 pt-4">
        <li className="hover:bg-orange-600 px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer w-full flex items-center space-x-2">
          <Tooltip title="About">
            <Link to="about">
              <MdInfo size={30} /> {/* Material icon */}
            </Link>
          </Tooltip>
        </li>
        <li className="hover:bg-orange-600 px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer w-full flex items-center space-x-2">
          <Tooltip title="Chat">
            <Link to="chat">
              <MdChat size={30} /> {/* Material icon */}
            </Link>
          </Tooltip>
        </li>
        <li className="hover:bg-orange-600 px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer w-full flex items-center space-x-2">
          <Tooltip title="Sign In">
            <Link to="form">
              <MdLogin size={30} /> {/* Material icon */}
            </Link>
          </Tooltip>
        </li>
      </ul>
      <div className="mb-4 px-2 flex items-center space-x-2">
        <Tooltip title="Dashboard">
        <Avatar alt={user.username} src={user.profileUrl} />
          <Link to="dashboard">
          </Link>
        </Tooltip>
      </div>
    </nav>
  );
};

export default Header;
