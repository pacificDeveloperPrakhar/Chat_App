import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUserAction, loginUserAction } from "../slices/userSlice";
import Toast from "./Toast";
import { useSelector } from 'react-redux';
import axios from "axios";

const Form = () => {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const info = useSelector(state => state.user);
  function input(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-orange-700">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if(!isLogin){
              setOpen(true)
              dispatch(addUserAction({ ...user }));
            }
            else
            dispatch(loginUserAction({...user}))
          
          }}
        >
          <div>
            <label className="block text-orange-700">
              Email
            </label>
            <input
              onChange={input}
              name="email"
              type="email"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
              placeholder={`Enter your email`}
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <label className="block text-orange-700">Username</label>
                <input
                  onChange={input}
                  type="username"
                  name="username"
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-orange-700">Password</label>
                <input
                  onChange={input}
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <label className="block text-orange-700">Confirm Password</label>
                <input
                  onChange={input}
                  type="password"
                  name="confirmPassword"
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="Confirm your password"
                />
              </div>
            </>
          )}
          {isLogin && (
            <div>
              <label className="block text-orange-700">Password</label>
              <input
                onChange={input}
                type="password"
                name="password"
                className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Enter your password"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
            <a href="#" className="text-orange-500 hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
        <div className="text-center mt-4">
          {isLogin ? (
            <p className="text-orange-700">
              New here?{" "}
              <span
                className="text-orange-500 hover:underline cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </span>
            </p>
          ) : (
            <p className="text-orange-700">
              Already a user?{" "}
              <span
                className="text-orange-500 hover:underline cursor-pointer"
                onClick={() => setIsLogin(true)}
              >
                Login here
              </span>
            </p>
          )}
        </div>
      </div>
      {info&&<Toast open={open} setOpen={setOpen} message={info.message}/>}
    </div>
  );
};

export default Form;
