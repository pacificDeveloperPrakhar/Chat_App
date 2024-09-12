import React, { useState } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { TbPasswordUser } from "react-icons/tb";


export default function () {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <form className="login-form">
        <h1 className="form-heading">Login </h1>
        
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
        
        <div className="input-group">
          <TfiEmail className="icon" />
          <input
            className="input-field"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
        </div>

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

        <div className="input-group">
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

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>
    </>
  );
}
