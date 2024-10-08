import React from 'react';
import ChatTile from './ChatTIle';
export default function ChatsDisplayWithinContainer({ convo }) {
  return (
    <div className="inset-0 absolute flex flex-col  p-4 chat_window_section_display">
      {/* Chat Container */}
      <div className="chat flex flex-col gap-4">
       <ChatTile sender={true} ></ChatTile>
       <ChatTile sender={true} ></ChatTile>
       <ChatTile sender={true} ></ChatTile>
       <ChatTile receiver={true} ></ChatTile>
       <ChatTile sender={true} ></ChatTile>
       <ChatTile receiver={true} ></ChatTile>
       <ChatTile sender={true} ></ChatTile>
       <ChatTile receiver={true} ></ChatTile>
       <ChatTile sender={true} ></ChatTile>
       <ChatTile receiver={true} ></ChatTile>
       <ChatTile sender={true} ></ChatTile>
       <ChatTile receiver={true} ></ChatTile>
       <ChatTile sender={true} ></ChatTile>
       <ChatTile sender={true} ></ChatTile>
       <ChatTile receiver={true} ></ChatTile>
       <ChatTile sender={true} ></ChatTile>
       <ChatTile receiver={true} ></ChatTile>
      </div>
    </div>
  );
}
