import React from 'react'
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, usersDbRef } from './firebase-config/firebase-config'
import philLogo from '../assets/phil-logo.png'
import { addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'


function Login() {

    const navigate = useNavigate()
  const provider= new GoogleAuthProvider()

  provider.setCustomParameters({
    prompt:"select_account"
  })

    async function handleSignIn(){
        try {
            const userCredential = await signInWithPopup(auth,provider);
            const newUser= userCredential._tokenResponse.isNewUser
            let user = userCredential.user
            

            if(newUser){

                await addDoc(usersDbRef , {
                    id: user.uid,
                    name:user.displayName,
                    photo:user.photoURL,
                    email:user.email
    
            
                })

                navigate("/chat")

            }

            navigate("/chat")
            
        } catch (error) {
            
        }
       


    }

  return (
    <>
        <div className="login-wrapper bg-black h-screen  flex flex-col justify-center items-center gap-24 text-white  ">

            <div>
                <img src={philLogo} className='min-w-[15rem]' alt="logo" />
            </div>
            
            <div onClick={handleSignIn} className='flex gap-4 text-3xl  text-center items-center cursor-pointer justify-center  rounded-3xl  w-11/12  '> 
                <div className=' ml-4 p-2 flex justify-center items-center bg-white  '> <i class="fa-brands text-black text-3xl  fa-google"></i> </div>
                <button className=' rounded-3xl p-2 border-2'> Sign in with Google </button>
            </div>
        </div>
    </>
  )
}
export default Login