import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { usersConnectionModify } from "../slices/userSlice";
import io from "socket.io-client";
import Avatar from '@mui/material/Avatar';
import { MdInfo, MdChat, MdLogin } from 'react-icons/md';
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
      console.log(message)
      dispatch(usersConnectionModify(message));
    });

    return () => {
      socketHeader.off('new_socket_connection');
      socketHeader.disconnect();
    };
  }, [dispatch, user]);

  return (
    <nav
      className="bg-orange-500 h-full flex flex-col justify-between text-white font-semibold p-4"
    >
      <ul className="space-y-4">
        <li className="hover:bg-orange-600 p-2 rounded transition duration-300 ease-in-out cursor-pointer flex items-center space-x-2">
          <Tooltip title="About">
            <Link to="about">
              <MdInfo size={30} />
            </Link>
          </Tooltip>
        </li>
        <li className="hover:bg-orange-600 p-2 rounded transition duration-300 ease-in-out cursor-pointer flex items-center space-x-2">
          <Tooltip title="Chat">
            <Link to="chat">
              <MdChat size={30} />
            </Link>
          </Tooltip>
        </li>
        <li className="hover:bg-orange-600 p-2 rounded transition duration-300 ease-in-out cursor-pointer flex items-center space-x-2">
          <Tooltip title="Sign In">
            <Link to="form">
              <MdLogin size={30} />
            </Link>
          </Tooltip>
        </li>
        <li className="hover:bg-orange-600 p-2 rounded transition duration-300 ease-in-out cursor-pointer flex items-center space-x-2">
          <Tooltip title="search people">
            <Link to="searchPeople">
              <MdLogin size={30} />
            </Link>
          </Tooltip>
        </li>
      </ul>
      <div className="flex items-center space-x-2">
        <Link to="dashboard">
        <Tooltip title="Dashboard">
          <Avatar alt={user.username} src={user.profileUrl} />
        </Tooltip>
          {/* Additional dashboard link */}
        </Link>
      </div>
    </nav>
  );
};

export default Header;
