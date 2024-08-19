import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { usersConnectionModify } from "../slices/userSlice";
import io from "socket.io-client";
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { MdInfo, MdChat, MdPersonSearch, MdLogin, MdDashboard } from 'react-icons/md';

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
      className="h-full flex flex-col justify-between bg-gradient-to-r from-purple-500 to-orange-500 py-6 text-white font-semibold shadow-xl"
    >
      <ul className="space-y-6">
        {/* About */}
        <li className="hover:bg-white hover:text-orange-600 p-3 rounded-xl transition transform hover:scale-105 duration-300 ease-in-out flex items-center space-x-3">
          <Tooltip title="About">
            <Link to="about">
              <MdInfo size={35} />
            </Link>
          </Tooltip>
        </li>
        
        {/* Chat */}
        <li className="hover:bg-white hover:text-orange-600 p-3 rounded-xl transition transform hover:scale-105 duration-300 ease-in-out flex items-center space-x-3">
          <Tooltip title="Chat">
            <Link to="chat">
              <MdChat size={35} />
            </Link>
          </Tooltip>
        </li>

        {/* Search People */}
        <li className="hover:bg-white hover:text-orange-600 p-3 rounded-xl transition transform hover:scale-105 duration-300 ease-in-out flex items-center space-x-3">
          <Tooltip title="Search People">
            <Link to="searchPeople">
              <MdPersonSearch size={35} />
            </Link>
          </Tooltip>
        </li>

        {/* Sign In */}
        <li className="hover:bg-white hover:text-orange-600 p-3 rounded-xl transition transform hover:scale-105 duration-300 ease-in-out flex items-center space-x-3">
          <Tooltip title="Sign In">
            <Link to="form">
              <MdLogin size={35} />
            </Link>
          </Tooltip>
        </li>
      </ul>

      <div className="flex items-center space-x-4">
        {/* Dashboard */}
        <Link to="dashboard">
          <Tooltip title="Dashboard">
            <Avatar alt={user.username} src={user.profileUrl} />
          </Tooltip>
        </Link>
        <Link to="dashboard">
          <Tooltip title="Dashboard">

          </Tooltip>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
