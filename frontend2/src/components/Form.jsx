import React, { useEffect, useState } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { TbPasswordUser } from "react-icons/tb";
import {AnimatePresence,motion} from "framer-motion"
import github from "../assets/logos/github.svg"
import google from "../assets/logos/google.svg"
import {useDispatch} from "react-redux";
import {loginUserAction,addUserAction} from "../slices/userSlice";
export default function () {
  const dispatch=useDispatch()
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [user,setUser]=useState({})
//  a function to handle the input when submitted from the form
function input(e){
   setUser({...user,[e.target.name]:e.target.value})
}
useEffect(()=>{})
  return (
    <>
      <motion.form className="login-form" initial={{opacity:0,x:-200}} animate={{opacity:1,x:0}} transition={{duration:0.8}}
      onSubmit={(e)=>{
        e.preventDefault();
        if(!isLogin)
        dispatch(addUserAction({...user}))
        else
        dispatch(loginUserAction({...user}))
      }}>
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
            onChange={input}
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
            onChange={input}
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
            onChange={input}
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
            onChange={input}
            className="input-field"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
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

        <div class="separator">
  <span>or proceed using</span>
</div>
<div className="flex justify-evenly bg-transparent p-4 ">
  <span className="flex items-center justify-center w-16 h-16 bg-white rounded-full transition-transform duration-100 hover:bg-gray-200 hover:scale-110">
    <img src={github} alt="GitHub logo" className="w-8 h-8" />
  </span>
  <span className="flex items-center justify-center w-16 h-16 bg-white rounded-full transition-transform duration-100 hover:bg-gray-200 hover:scale-110">
    <img src={google} alt="Google logo" className="w-8 h-8" />
  </span>
</div>


      </motion.form>
    </>
  );
}
