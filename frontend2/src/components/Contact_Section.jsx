import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import {setSelectedConversation} from "../slices/utilsSlice"
import StartNewChatWith from './StartNewChatWith';
import ChatTab from './Chat_Tab';
import { RiInboxArchiveLine } from "react-icons/ri";
import ConversationItem from './ConversationItem';
import SelectPeopleFooter from './SelectPeopleFooter';
import { useSelector } from 'react-redux';
import { createContext } from 'react';
export default function Contact_Section() {
  //on the basis of the openNewChatNav all the states will be rendered accordingly
  //if the openNewChatNav is set to true then all the people will displayed 
  //otherwise all communication will be displayed
  const openNewChatNav=useSelector(state=>state.utils.openNewChatNav)
  const users=useSelector(state=>state.user.users)
  const dispatch=useDispatch()
  const conversations=useSelector(state=>state.conversations.conversations)
  const [selected_convo, setSelected] = useState(null);
  const handleSelectConversation = (convo) => {
    setSelected(convo);
    dispatch(setSelectedConversation(convo))
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
        <div id="people_convos_and_buttons  flex flex-col ">

        <AnimatePresence>
        {openNewChatNav&&
        <SelectPeopleFooter/>
}
      {!openNewChatNav?<motion.ul layout className=' '>

          {<>
          {users.length&&
          <>
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
          </>}
            </>}
      </motion.ul>:<StartNewChatWith/>}

        </AnimatePresence>
                  </div>
    </div>
  );
}