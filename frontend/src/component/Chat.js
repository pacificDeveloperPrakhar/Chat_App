import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";



const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const user=useSelector(state=>state.user.user)
  let socket;
  // Listen for incoming messages 
  useEffect(() => {
    // Connect to the server (replace with your backend URL if deployed)
      socket = io("http://127.0.0.1:1234/chat",{
     extraHeaders:{
     "userId":JSON.stringify(user)
  }
});
    socket.on("chatMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up on component unmount
    return () => {
      socket.off("chatMessage");
    };
  }, []);

  // Handle sending messages
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", message); // Send message to server
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 to-orange-400">
      <div className="flex-grow flex flex-col">
        {/* Chat area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white bg-opacity-20">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`${
                  index % 2 === 0
                    ? "bg-white text-gray-800"
                    : "bg-gradient-to-r from-purple-500 to-orange-400 text-white"
                } p-3 rounded-xl max-w-xs shadow-lg`}
              >
                {msg}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <form
          className="flex items-center p-4 bg-white bg-opacity-70"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-4 bg-gradient-to-r from-purple-600 to-orange-400 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-orange-500 transition duration-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
