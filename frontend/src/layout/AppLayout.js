import React, { useEffect } from 'react';
import {Outlet} from 'react-router-dom'
import Header from '../component/Header';
import { useDispatch } from "react-redux";
import { addUserAction, loginUserAction } from "../slices/userSlice";
import { Provider } from 'react-redux';
import Store  from '../store/store';
const AppLayout = () => {
  return (
    <Provider store={Store}>

    <div>
      <Header />
      <Outlet />
    </div>
    </Provider>
  );
}

export default AppLayout;
