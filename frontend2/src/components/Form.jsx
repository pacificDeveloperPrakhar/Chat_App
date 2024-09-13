import React, { useState } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { TbPasswordUser } from "react-icons/tb";
import {AnimatePresence,motion} from "framer-motion"

export default function () {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <motion.form className="login-form" initial={{opacity:0,x:-200}} animate={{opacity:1,x:0}} transition={{duration:0.8}}>
        <h1 className="form-heading">{isLogin?"Login":"Sign in"} </h1>
        <div className="tabs ">
          <div className='tabs_tab ' onClick={()=>setIsLogin(false)}>

            {!isLogin&&<motion.div className="selected_bg " layoutId="select"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />}
            <span className='text'>Sign In</span>
          </div>
          <div className='tabs_tab' onClick={()=>setIsLogin(true)}>
          {isLogin&&<motion.div layoutId="select" className="selected_bg "
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />}
            <span className='text'>Log In</span>
          </div>
        </div>
        <div className="input-group">
          <FaRegUserCircle className="icon" />
          <input
            className="input-field"
            type="text"
            name="username"
            id="username"
            placeholder="Username"
          />
        </div>
        
        {!isLogin&&<div className="input-group">
          <TfiEmail className="icon" />
          <input
            className="input-field"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
        </div>}

        <div className="input-group">
          <TbPasswordUser className="icon" />
          <input
            className="input-field"
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Password"
          />
          {showPassword ? (
            <IoEyeOutline
              className="icon toggle-password"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEyeOffOutline
              className="icon toggle-password"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {!isLogin&&<div className="input-group">
          <TbPasswordUser className="icon" />
          <input
            className="input-field"
            type={showPassword ? "text" : "password"}
            name="confirm_password"
            id="confirm_password"
            placeholder="Confirm Password"
          />
           {showPassword ? (
            <IoEyeOutline
              className="icon toggle-password"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEyeOffOutline
              className="icon toggle-password"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
}
        <button type="submit" className="submit-btn">
          {isLogin?"Login":"Sign in"}
        </button>
      </motion.form>
    </>
  );
}
