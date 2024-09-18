// ChatTab.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineChat } from "react-icons/md";
import { motion } from "framer-motion";

const ChatTab = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewChat = () => {
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

  };

  return (
    <div className="chat-tab">
      <div className="chat-tab-header">
        <h2>Chats</h2>
        <MdOutlineChat className="new-chat-icon" onClick={handleNewChat} title="New Chat" />
      </div>


      {<motion.div className="chat-tab-tabs" layout>
        {['unread', 'all', 'group'].map(tab => (
          <div key={tab} className="relative tab_bar" onClick={() => handleTabClick(tab)}>
            <motion.span
              className={`tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.span>
            {activeTab === tab && (
              <motion.div
                className="active-tab-background"
                layoutId="activeTabBackground"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </div>
        ))}
      </motion.div>}

      <div className="chat-tab-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search chats"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default ChatTab;
