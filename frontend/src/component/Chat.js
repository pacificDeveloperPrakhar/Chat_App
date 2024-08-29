import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import socket, { setSocket } from "../socket";

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

// Debounce utility function
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const ChatApp = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const user = useSelector(state => state.user.user);
  const users = useSelector(state => state.user.users);
  const conversations = useSelector(state => state.conversations.conversations);

  useEffect(() => {
    setSocket({ user });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("state_changed_for_room", (data) => {
      const { isTyping, userId } = data;
      if (isTyping) {
        const typingUser = users.find(user => user.id === userId);
        setTypingUser(typingUser);
        setTimeout(() => setTypingUser(null), 800);
      } else {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("chatMessage");
      socket.off("onlineUsers");
      socket.off("state_changed_for_room");
    };
  }, [user, users]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", { text:message, userId: user.id, conversationId: selectedConversation.id });
      setMessage('');
      socket.emit("state_changed_for_room", { userId: user.id, conversationId: selectedConversation.id, isTyping: false });
    }
  };

  // Debounce the handleTyping function
  const debouncedTyping = useCallback(
    debounce(() => {
      socket.emit("state_changed_for_room", { userId: user.id, conversationId: selectedConversation.id, isTyping: true });
    }, 300),
    [user, selectedConversation]
  );

  const handleTyping = (e) => {
    setMessage(e.target.value);
    debouncedTyping();
  };

  const getOnlineStatus = (participant) => {
    return onlineUsers.includes(participant.id) ? 'dot' : 'dotOffline';
  };

  const renderConversationTitle = (conversation) => {
    if (conversation.participantsNames.length === 1) {
      return conversation.participantsNames[0];
    }
    return conversation.participantsNames.join(', ');
  };

  const renderProfilePictures = (conversation) => {
    if (conversation.profileUrls && conversation.profileUrls.length > 1) {
      return (
        <div className="flex -space-x-2">
          {conversation.profileUrls.slice(0, 2).map((url, index) => (
            <Avatar key={index} src={url} alt="profile" sx={{ width: 40, height: 40 }} />
          ))}
        </div>
      );
    }
    return (
      <Avatar
        src={conversation.profileUrls[0] || null}
        alt={renderConversationTitle(conversation)}
        sx={{ width: 56, height: 56 }}
      />
    );
  };

  return (
    <div className="flex h-screen">
      {/* Conversations Section */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        <ul>
          {conversations?.map((conversation) => (
            <li
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-2 cursor-pointer rounded-lg mb-2 flex items-center ${
                selectedConversation?.id === conversation.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-black'
              }`}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant={getOnlineStatus(conversation.participants[0])} // Assuming the first participant
              >
                {renderProfilePictures(conversation)}
              </StyledBadge>
              <span className="ml-2">{renderConversationTitle(conversation)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex-grow flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-orange-600 text-white flex items-center">
              {renderProfilePictures(selectedConversation)}
              <h1 className="ml-4">{renderConversationTitle(selectedConversation)}</h1>
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
              {/* Display typing indicator */}
              {typingUser && (
                <div className="flex items-center mt-2">
                  <span className="text-gray-500">{typingUser.username} is typing...</span>
                </div>
              )}
            </div>

            {/* Message Input Section */}
            <form
              className="flex p-4 bg-white bg-opacity-70 fixed bottom-0 right-0 left-1/4"
              onSubmit={sendMessage}
            >
              <input
                type="text"
                value={message}
                onChange={handleTyping}
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
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
