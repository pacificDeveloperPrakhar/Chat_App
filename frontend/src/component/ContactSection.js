import React, { useState } from 'react';

const participants = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Michael Johnson' },
  { id: 4, name: 'Emily Davis' },
];

const ChatApp = () => {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [message, setMessage] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    // Logic to send the message
    console.log(`Message sent to ${selectedParticipant.name}: ${message}`);
    setMessage('');
  };

  return (
    <div className="flex h-screen">
      {/* Contact Section */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Contacts</h2>
        <ul>
          {participants.map((participant) => (
            <li
              key={participant.id}
              onClick={() => setSelectedParticipant(participant)}
              className={`p-2 cursor-pointer rounded-lg mb-2 ${
                selectedParticipant?.id === participant.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-black'
              }`}
            >
              {participant.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex-grow flex flex-col bg-white">
        {selectedParticipant ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-purple-600 text-white">
              Chatting with {selectedParticipant.name}
            </div>

            {/* Chat Messages Section */}
            <div className="flex-grow p-4">
              {/* Placeholder for chat messages */}
              <p>No messages yet</p>
            </div>

            {/* Message Input Section */}
            <form
              className="absolute bottom-0 right-0 left-1/4 p-4 bg-white bg-opacity-70 flex items-center space-x-4"
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
                className="bg-gradient-to-r from-purple-600 to-orange-400 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-orange-500 transition duration-300"
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
