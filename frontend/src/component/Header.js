import React, { useEffect ,useRef} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { usersConnectionModify } from "../slices/userSlice";
import io from "socket.io-client";
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Info, Chat, PersonSearch, Login, Close } from '@mui/icons-material';  // Import Material Design Icons
import ContactSection from "./ContactSection"

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const users = useSelector(state => state.user.users);
  const [drawerOpen, setDrawerOpen] = React.useState(false);  // State to control drawer

  let socketHeader;
  const socketConversation=useRef(null);

  useEffect(() => {
    socketHeader = io("http://127.0.0.1:1234/%HEADERS%", {
      extraHeaders: {
        "userId": JSON.stringify(user),
      },
      path: "/chat",
    });
    // another socket for the conversation creation and the conversation about receiver
    socketConversation.current = io("http://127.0.0.1:1234", {
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

  const toggleDrawer = (open) => {
    setDrawerOpen(open);  // Open or close drawer
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <div className="flex justify-between p-2">
        {/* Add Close Button */}
        <IconButton onClick={() => toggleDrawer(false)}>
          <Close />
        </IconButton>
      </div>
      {/* Contact Section */}
      <ContactSection onParticipantSelect={(participants,setSelectedParticipants) =>{ socketConversation.current.emit("create_conversations", {me:user,users:participants})}} />
    </Box>
  );

  return (
    <nav className="h-full flex flex-col justify-between bg-gradient-to-r from-purple-500 to-orange-500 py-2 text-white font-semibold shadow-xl">
      <ul className="space-y-6">
        {/* About */}
        <li className="hover:bg-white hover:text-orange-600 p-3 transition transform hover:scale-105 duration-300 ease-in-out flex items-center space-x-3">
          <Tooltip title="About">
            <Link to="about">
              <Info size={35} />
            </Link>
          </Tooltip>
        </li>
        
        {/* Chat */}
        <li className="hover:bg-white hover:text-orange-600 p-3 transition transform hover:scale-105 duration-300 ease-in-out flex items-center space-x-3">
          <Tooltip title="Chat">
            <Link to="chat">
              <Chat size={35} />
            </Link>
          </Tooltip>
        </li>

        {/* Search People */}
        <li className="hover:bg-white hover:text-orange-600 p-3 transition transform hover:scale-105 duration-300 ease-in-out flex items-center space-x-3">
          <Tooltip title="Search People">
            <IconButton onClick={() => toggleDrawer(true)}>
              <PersonSearch size={35} />
            </IconButton>
          </Tooltip>
        </li>

        {/* Sign In */}
        <li className="hover:bg-white hover:text-orange-600 p-3 transition transform hover:scale-105 duration-300 ease-in-out flex items-center space-x-3">
          <Tooltip title="Sign In">
            <Link to="form">
              <Login size={35} />
            </Link>
          </Tooltip>
        </li>
      </ul>

      <div className="flex items-center space-x-4 px-3">
        {/* Dashboard */}
        <Link to="dashboard">
          <Tooltip title="Dashboard">
            <Avatar alt={user.username} src={user.profileUrl} />
          </Tooltip>
        </Link>
      </div>

      {/* Drawer Component */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </nav>
  );
};

export default Header;
