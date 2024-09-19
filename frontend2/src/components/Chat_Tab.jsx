// ChatTab.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiChatNewLine } from "react-icons/ri";
import { IoMdArrowBack } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch,useSelector } from 'react-redux';
import {toggleNewChatNav} from "../slices/utilsSlice"
const ChatTab = () => {
  const dispatch=useDispatch()
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const openNewChatNav=useSelector(state=>state.utils.openNewChatNav)
  const handleNewChat = () => {
    //here i will be dispatching the toggle new chat navigation panel to open the nav which will show the list of all people
    //registered
   dispatch(toggleNewChatNav())
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

  };

  return (
    <div className="chat-tab">
      <div className="chat-tab-header overflow-x-hidden">
      <AnimatePresence>
        {!openNewChatNav?<motion.h2>Chats</motion.h2>:<motion.h2>Start new chat</motion.h2>}
      </AnimatePresence>
        <span className='header_button'  onClick={handleNewChat}>
          {

            openNewChatNav?<IoMdArrowBack  className="text-white" title="back to conversation"/>:<RiChatNewLine className="new-chat-icon" title="New Chat" />
          }

        </span>
      </div>


      {
 <AnimatePresence>
 {!openNewChatNav&& (  // Add a conditional check for rendering the motion.div
   <motion.div
     className="chat-tab-tabs"
     layout
     initial={{ opacity: 0,}} 
     animate={{ opacity: 1, x: 0 }} 
     exit={{  opacity: 0 }} 
     transition={{
       duration: 0.27,
     }}
   >
     {['unread', 'all', 'group'].map((tab) => (
       <div key={tab} className="relative tab_bar" onClick={() => handleTabClick(tab)}>
         <motion.span className={`tab ${activeTab === tab ? 'active' : ''}`}>
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
   </motion.div>
 )}
</AnimatePresence>

      }

      <motion.div className="chat-tab-search" layoutId='search'>
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder={openNewChatNav?"Search by username":"search chats"}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </motion.div>
    </div>
  );
};

export default ChatTab;
