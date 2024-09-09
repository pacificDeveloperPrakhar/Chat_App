import React from 'react';
// Assuming you use CSS for the styling
// i did generate this file using chat gpt to have an idea of how my chat layout would turn out to be and take inspiration
// also have a reference to how my chat app should be like
const WhatsAppLayout = () => {
  return (
    <div className="container">
      {/* Sidebar (Left Panel) */}
      <div className="sidebar">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <h3>User Profile</h3>
        </div>
        {/* Chat List */}
        <div className="chat-list">
          <p>Chat 1</p>
          <p>Chat 2</p>
          <p>Chat 3</p>
          {/* You can repeat this or map over actual chat data */}
        </div>
        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <p>Settings</p>
        </div>
      </div>

      {/* Chat Area (Right Panel) */}
      <div className="chat-area">
        {/* Chat Header */}
        <div className="chat-header">
          <h3>Chat Name</h3>
        </div>
        {/* Message History */}
        <div className="message-history">
          <p>Message 1</p>
          <p>Message 2</p>
          <p>Message 3</p>
          {/* You can map over actual messages here */}
        </div>
        {/* Chat Footer / Input Area */}
        <div className="chat-footer">
          <input type="text" placeholder="Type a message..." />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppLayout;
