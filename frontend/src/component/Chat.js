import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

// StyledBadge for online status
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    backgroundColor: '#44b700',
    color: '#44b700',
  },
  '& .MuiBadge-dotOffline': {
    backgroundColor: '#f44336',
    color: '#f44336',
  },
}));

const ChatApp = () => {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useSelector(state => state.user.user);
  const users = useSelector(state => state.user.users); // Assuming `users` is the list of all users

  let socket;

  useEffect(() => {
    socket = io("http://127.0.0.1:1234", {
      extraHeaders: {
        "userId": JSON.stringify(user)
      },
      path: "/chat"
    });

    socket.on("chatMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("onlineUsers");
      socket.disconnect();
    };
  }, [user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", { message, userId: user.id, recipientId: selectedParticipant.id });
      setMessage('');
    }
  };

  const getOnlineStatus = (user) => {
    return user.userStatus=="active" ? 'dot' : 'dotOffline';
  };

  return (
    <div className="flex h-screen">
      {/* Contact Section */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Contacts</h2>
        <ul>
          {users?.map((participant) => (
            <li
              key={participant.id}
              onClick={() => setSelectedParticipant(participant)}
              className={`p-2 cursor-pointer rounded-lg mb-2 flex items-center ${
                selectedParticipant?.id === participant.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-black'
              }`}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant={getOnlineStatus(participant)}
              >
                <Avatar alt={participant.username} src={participant.profileUrl} />
              </StyledBadge>
              <span className="ml-2">{participant.username}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex-grow flex flex-col bg-white">
        {selectedParticipant ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-orange-600 text-white flex items-center">
              <Avatar
                alt={selectedParticipant.username}
                src={selectedParticipant.profileUrl}
                sx={{ width: 56, height: 56 }}
              />
              <h1 className="ml-4">{selectedParticipant.username}</h1>
            </div>

            {/* Chat Messages Section */}
            <div className="flex-grow p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.userId === user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      msg.userId === user.id
                        ? "bg-orange-400 text-white ml-4"
                        : "bg-white text-gray-800 mr-4"
                    } p-3 rounded-xl max-w-xs shadow-lg`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Section */}
            <form
              className="flex p-4 bg-white bg-opacity-70 fixed bottom-0 right-0 left-1/4"
              onSubmit={sendMessage}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="ml-4 bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition duration-300"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center flex-grow">
            <p>Select a participant to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
