import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {motion,AnimatePresence} from "framer-motion"
export default function StartNewChatWith() {
    const users=useSelector(state=>state.user.users)
    useEffect(()=>{},[])
  return (
    <>
    {
        users.map((user)=>{
            return <>
            <AnimatePresence>
                <motion.li
                key={user.id}
                className="relative"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                onClick={() => handleSelectUser(convo.conversation)}>
                </motion.li>
            </AnimatePresence>
            
            </>
        })
    }
    </>
  )
}
// users = [{
//     id: "3b562e2c-c44e-44b2-8f5e-7ac993a4aba4",
//     email: "prakharvision@gmail.com",
//     username: "prakharvision",
//     is_verified: true,
//     profileUrl: "https://res.cloudinary.com/dcbyetumq/image/upload/v1726682088/profiles/tspzdbih10opfnsngpi1.webp",
//     userStatus: "inactive",
//     createdAt: "2024-08-24T18:44:33.817Z",
//     updatedAt: "2024-09-18T18:28:32.307Z",
//     socketConnected: null, // This was empty, setting as null
//     password: "$2b$10$PURB33/xukQuz0MrNJ0CwOc/mJSXIKY8aI3mJywJeIR7SkX1KG8Hi",
//     passwordResetToken: "$2b$10$6ylNREx4UDk0alASjEB4yuTKo23yMaSiNbSIjqMSNej5jad66Jf5q",
//     passwordResetExpires: "2024-08-24T13:24:47.415Z"
//   }];