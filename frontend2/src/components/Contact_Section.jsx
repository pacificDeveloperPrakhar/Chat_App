import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StartNewChatWith from './StartNewChatWith';
import ChatTab from './Chat_Tab';
import { RiInboxArchiveLine } from "react-icons/ri";
import ConversationItem from './ConversationItem';
import { useSelector } from 'react-redux';
export default function Contact_Section() {
  //on the basis of the openNewChatNav all the states will be rendered accordingly
  //if the openNewChatNav is set to true then all the people will displayed 
  //otherwise all communication will be displayed
  const openNewChatNav=useSelector(state=>state.utils.openNewChatNav)
  const users=useSelector(state=>state.user.users)
  const conversations=useSelector(state=>state.conversations.conversations)
  const [selected_convo, setSelected] = useState(null);

  const handleSelectConversation = (convo) => {
    setSelected(convo);
  };

  return (
    <div className="contact_section flex-auto flex flex-col relative">
      <ChatTab />
      <AnimatePresence>
      {!openNewChatNav&&<motion.div className="Archived_Bar" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:1}}
      transition={{
        duration:0.1
      }}>
        <RiInboxArchiveLine className="archive-icon" />
        <span className="archive-text">This archived message</span>
      </motion.div>
}
      </AnimatePresence>
      <motion.ul layout initial={{opacity:0,x:-100}} animate={{opacity:1,x:0}} transition={{duration:0.01}}>
        <AnimatePresence>

          {!openNewChatNav?<>
          {conversations.map((convo, index) => {
            return (
              <motion.li
              key={convo.id}
                className="relative"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                onClick={() => handleSelectConversation(convo)}
                >
                <ConversationItem
                  convo={convo}
                  users={users}
                  selected_convo={selected_convo}
                />
              </motion.li>
            );
          })}
            </>:<StartNewChatWith/>}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}