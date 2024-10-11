import { RouterProvider,createBrowserRouter,createRoutesFromElements,Route, Navigate } from "react-router-dom"
import Root from "./components/Root"
import Login from "./components/Login"
import Chat from "./components/Chat"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./components/firebase-config/firebase-config"
import ChatRoom from "./components/ChatRoom"
import FindUsers from "./components/FindUsers"
import PersonalChat from "./components/PersonalChat"
import Loading from "./components/Loading"


export default function App() {


   const [user,loading]=  useAuthState(auth)

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root/>} >

      <Route index   element={loading?<Loading/> :user? <Navigate to="chat"/>:<Navigate to="login"/> } />

      <Route path="login"    element={<Login/>} />
      
      <Route path="chat"   element={loading?<Loading/> :user? <Chat/>:<Navigate to="/login"/>} >

          <Route index element={loading?<Loading/> :user? <Navigate to="chat-room"/>:<Navigate to="/login"/>}  />

          <Route path="find-users" element={loading?<Loading/> :user? <FindUsers/>:<Navigate to="/login"/>}  />
          
          <Route path="chat-room"  element={loading?<Loading/> :user? <ChatRoom/>:<Navigate to="/login"/>}  />

      </Route>

      <Route path="chat/chat-room/:id"  element={loading?<Loading/> :user? <PersonalChat/>:<Navigate to="/login"/>}  />
  
    </Route>
  ))
  

  return (

    <RouterProvider router={router}/>
  )
}