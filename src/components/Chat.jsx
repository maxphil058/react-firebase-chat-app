import React, { useState } from 'react'
import philLogo from '../assets/phil-logo.png'
import { auth } from './firebase-config/firebase-config'
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from 'firebase/auth';
import { Outlet, useNavigate } from 'react-router-dom';


function Chat() {

  const [user] = useAuthState(auth)
  const [isSignOutActive,setIsSignOutActive] = useState(false)
  const navigate= useNavigate()


  function handleSignOut(){

    signOut(auth)
    navigate("/login")

  } 


  return (
    <div className="chat-wrapper h-screen bg-black text-white flex flex-col  p-2 gap-12  ">
      <div className='flex flex-row justify-between '>
        <div> <img src={philLogo} alt="" className='w-[8rem]  object-contain ' /> </div>
        <div className='border-2 border-white rounded-[100%] relative'>
           <img src={user && user?.photoURL} alt="profile logo" className='rounded-[100%] w-[5rem] h-[5rem]  border-2 border-black' onClick={()=>setIsSignOutActive(!isSignOutActive)} />
           
           {isSignOutActive && <div className='logout-btn absolute border-2 border-red-400'> <button onClick={handleSignOut} className="  border-2  border-black p-2 rounded-[20px] "> Logout </button> </div>}

         </div>
      </div>

      <Outlet/>





    </div>
  )
}

export default Chat