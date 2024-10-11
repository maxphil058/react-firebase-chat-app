import React from 'react'
import usersPic from "../assets/phil-chat-users.png"
import { useState } from 'react'
import { auth , messagesDbRef, usersDbRef} from './firebase-config/firebase-config'
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


function FindUsers() {

  const [user] = useAuthState(auth)
  const [input,setInput] = useState("")
  const navigate= useNavigate()

    async function  handleSearch(e){

    e.preventDefault();
    if(input.trim()===""){ return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No user typed",
      iconColor:"black",
      confirmButtonColor:"black"

    })};

    if(input.trim() == `${user.email}` ){

      return Swal.fire({
        icon: "error",
        title: "Brev...",
        text: "That's your email",
        iconColor:"black",
        confirmButtonColor:"black"}) }


        let stringInput= input.trim().toString();

    const q= query(usersDbRef,where("email","==",stringInput))

    const receiver = await getDocs(q)

    const receiverObj = receiver.docs.map( (doc)=>{return { ...doc.data()} }  )

    if(receiver.empty){ return Swal.fire({
                        icon: "error",
                        title: "Sorry brev...",
                        text: "User doesnt exist!",
                        iconColor:"black",
                        confirmButtonColor:"black"
                        })} 
    else{
      Swal.fire({
        title: "User Found!",
        icon: "success",
        iconColor:"black",
      confirmButtonColor:"black"
      });

      const receiverObj = receiver.docs.map( (doc)=>{return { ...doc.data()} }  )

    }

    const chatRoom = query(
      messagesDbRef, 
      where("recipientUID","in",[receiverObj[0].id,user.uid]),
      where("senderUID","in",[user.uid,receiverObj[0].id]),
      where("created","==",true) 
    )
        

    // // get document id so we can update messages
    let data =  await getDocs(chatRoom)

    const chatRoomData = data.docs.map( (doc)=>{return { ...doc.data()} }  );

    if(chatRoomData.length==0 ){

      await addDoc( messagesDbRef, {
        senderUID : user?.uid,
        senderName:  "Philip Mgbudem",
        recipientUID: receiverObj[0].id,
        recipientName: receiverObj[0].name,
        created:true,  } ) 

      }

        
    
    
    navigate(`/chat/chat-room/${receiverObj[0].id}`)
    
    setInput("")
}



  return (
    <>
         <div className=' relative justify-self-center self-center'>

        <img src={usersPic} alt="" className='rounded-[100%]' />

        <i  onClick={()=>navigate(-1)} class=" top-[0%] left-[-30%] fa-solid fa-arrow-left absolute text-white text-6xl font-bold  "></i>
      </div>
      
      
      <div className='flex flex-col justify-center items-center gap-12  text-3xl pb-12 '>
       
        <label htmlFor="search" className=' text-4xl text-wrap text-center'> Search Users <i class="fa-solid fa-globe"></i> </label>
      
        <input type="text" id="search" className='text-2xl cursor-text text-center w-11/12 rounded-3xl p-2 text-black ' placeholder='Type User Email..' value={input} onChange={(e)=>setInput(e.target.value)}/>     

        <button className='border-4 border-white p-4 rounded-3xl' onClick={handleSearch} >Search <i class="fa-solid fa-magnifying-glass rounded-3xl cursor-pointer " ></i>  </button>
      
      </div>
    </>
  )
}

export default FindUsers