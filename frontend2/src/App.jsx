import { useState, } from 'react'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import './styles/App.css'
import AppLayout from './AppLayout'
import Registration from './components/Registration'
import ChatLayout from './components/ChatLayout'
import ErrorElement from './components/errorElement'
import Me from './components/Me.jsx';
import Setting from './components/Setting.jsx'
import {Provider} from "react-redux"
import store from './store/store.jsx'
import ChatSection from './components/ChatSection.jsx'

// setting up the routes
const routes=createBrowserRouter([
  {
    path:"/",
    element:<AppLayout/>,
    children:[
      {
        path:"/form",
        element:<Registration/>
      },
      {
        path:"/chat_screen_layout",
        element:<ChatLayout/>,
        children:[
          {
            path:"",
            element:<ChatSection/>
          },
          {
            path:"me",
            element:<Me/>
          },
          {
            path:"setting",
            element:<Setting/>
          }
        ]
      },
    ],
    errorElement:<ErrorElement/>
  }
])

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Provider store={store}>
    <RouterProvider router={routes}/>
    </Provider>
    </>
  )
}

export default App
