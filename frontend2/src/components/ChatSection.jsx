import React from 'react'
import Contact_Section from './Contact_Section';
import ChatContainer from './ChatContainer';
export default function ChatSection() {
    
  return (
    <>
      {<Contact_Section/>}
      <div className="chatContainer relative" style={{ flexGrow:6 }}>
      <ChatContainer/>
      </div>
    </>
  )
}
