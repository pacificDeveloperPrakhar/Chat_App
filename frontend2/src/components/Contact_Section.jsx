import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatTab from './Chat_Tab';
import { RiInboxArchiveLine } from "react-icons/ri";
import ConversationItem from './ConversationItem';
import { useSelector } from 'react-redux';
export default function Contact_Section() {
  const users=useSelector(state=>state.user.users)
  const conversations=useSelector(state=>state.conversations.conversations)
  const [selected_convo, setSelected] = useState(null);

  const handleSelectConversation = (convo) => {
    setSelected(convo);
  };

  return (
    <div className="contact_section flex-auto flex flex-col">
      <ChatTab />
      <div className="Archived_Bar">
        <RiInboxArchiveLine className="archive-icon" />
        <span className="archive-text">This archived message</span>
      </div>

      <ul>
        <AnimatePresence>
          {conversations.map((convo, index) => {
            return (
              <motion.li
                key={convo.id}
                className="relative"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                onClick={() => handleSelectConversation(convo.conversation)}
              >
                <ConversationItem
                  convo={convo}
                  users={users}
                  selected_convo={selected_convo}
                />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
