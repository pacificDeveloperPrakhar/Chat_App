import React from 'react';
import ReactDOM  from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './utils/ProtectedRoute';
import Form from './component/Form'
import Dashboard from './component/Dashboard';
import About from './component/About';
import Chat from "./component/Chat";
const routers = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Form />,
        errorElement: <h1>not found</h1>,
      },
      {
        path: "form",
        element: <Form />,
      },
      {
        path: "",
        element: <ProtectedRoute />,
        children:[{
          path: "about",
          element: <About />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path:"chat",
          element:<Chat/>
        }
      ]
      },
  
    ],
    errorElement: (
      <h1>
        sorry this functionality is either unavailable yet or you are on the
        invalid route
      </h1>
    ),
  },
]);
ReactDOM.createRoot(document.getElementsByTagName("body")[0]).render(<RouterProvider router={routers}/>)

