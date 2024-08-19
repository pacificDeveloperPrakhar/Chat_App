import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../component/Header';
import { Provider } from 'react-redux';
import Store from '../store/store';

const AppLayout = () => {
  return (
    <Provider store={Store}>
      <div className="flex h-screen">
        {/* Header positioned on the left */}
        <div className=" h-full">
          <Header />
        </div>
        {/* Main content (chat, other views) on the right */}
        <div className="flex-grow h-full">
          <Outlet />
        </div>
      </div>
    </Provider>
  );
};

export default AppLayout;
