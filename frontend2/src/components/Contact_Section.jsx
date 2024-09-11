import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatTab from './Chat_Tab';
import { RiInboxArchiveLine } from "react-icons/ri";
import ConversationItem from './ConversationItem';

export default function Contact_Section() {
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
          {[{ conversation: 1 }, { conversation: 2 }, { conversation: 3 }, { conversation: 4 }].map((convo, index) => {
            return (
              <motion.li
                key={convo.conversation}
                className="relative"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                onClick={() => handleSelectConversation(convo.conversation)}
              >
                <ConversationItem
                  convo={convo}
                  selected_convo={selected_convo}
                  unreadMessages={3}
                />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
