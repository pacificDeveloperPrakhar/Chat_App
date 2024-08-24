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
    if(!user)
      return
    socketHeader = io("http://127.0.0.1:3124/%HEADERS%", {
      extraHeaders: {
        "userId": JSON.stringify(user),
      },
      path: "/chat",
    });
    // another socket for the conversation creation and the conversation about receiver
    socketConversation.current = io("http://127.0.0.1:3124", {
      extraHeaders: {
        "userId": JSON.stringify(user),
      },
      path: "/chat",
    });
// this is where i am trying to dispatching the actions to store all the users available received and conversations that happend or involved the user
    socketHeader.on('new_socket_connection', ({users,conversations}) => {
     
      dispatch(usersConnectionModify(users));
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
      <ul className="space-y-6 box-content">
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
            <IconButton >
          
              <Chat size={35} />
            </IconButton>
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
          <IconButton >
            <Avatar alt={user.username} src={user.profileUrl} sx={{}} />
          </IconButton>
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
