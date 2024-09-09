import React from 'react'

export default function Contact_Section() {
  return (
    <div className="contact_section flex-auto bg-white">
        <ul>
            {[{conversation:1},{conversation:2},{conversation:3},{conversation:4}].map((convo)=>{
                return <li className=''>
                    <div className="conversation">
                    <span className="time-span">12:30 PM</span>
                   {convo.conversation}
                    </div>
                </li>
            })}
        </ul>
    </div>
  )
}
