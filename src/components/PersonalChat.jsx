import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { messagesDbRef, usersDbRef } from './firebase-config/firebase-config'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase-config/firebase-config'
import { useNavigate } from 'react-router-dom'
import { db } from './firebase-config/firebase-config'

import { useRef } from 'react'


function PersonalChat() {

    const [ input , setInput] = useState("")
    const [ recipientInfo,setRecipientInfo] = useState([])
    const [user,loading] = useAuthState(auth)
    const [chatID,setChatID] = useState("")
    const [fullChatArr,setFullChatArr]=useState([])
    const navigate = useNavigate()
    const {id }= useParams()

    const lastMessageRef = useRef(null)

    useEffect(()=>{

        let unsuscribe; 

        async function getCurrentChatData () {
     try {
           
        const chatRoom = query(
            messagesDbRef, 
            where("recipientUID","in",[id,user.uid]),
            where("senderUID","in",[user.uid,id]),
            where("created","==",true) 
          )
        // get document id so we can update messages
        let data =  await getDocs(chatRoom)
        let myMessageDocId;
        data.docs.forEach((doc)=>{ myMessageDocId = doc.id }  )

        setChatID(myMessageDocId)


         let fullChatDbRef= collection(db,"messages",myMessageDocId,"messageDoc")

         let order = query(fullChatDbRef, orderBy("createdAt"))

            
            unsuscribe = onSnapshot(order, (snapshot)=>{
            
            let fullChat = snapshot.docs.map(( doc)=>{return{ ...doc.data() }})

            setFullChatArr(fullChat)

        } )

     } catch (error) {

        console.log(error)

     }
        }

        getCurrentChatData()

        return ()=> {if(unsuscribe) unsuscribe()}

     }
    ,[id] )


     useEffect(()=>{


            lastMessageRef.current?.scrollIntoView({"behaviour":"smooth"})
        
     },[fullChatArr])


    useEffect(()=>{

        async function getRecipientInfo(){

            const q= query( usersDbRef, where("id","==",id))
            let data = await getDocs(q);
            let info = data.docs.map((doc)=>{return {...doc.data() } })

            setRecipientInfo(info)

        }

        getRecipientInfo()

    } ,[] )

    async function handleSend(){

        try {

            if(input.trim()==""){
                return
            }

            if(chatID){

                await  addDoc( collection(db,"messages",chatID,"messageDoc"), {
                 text: input,
                 senderID: user.uid, 
                 senderName:user.displayName,
                 createdAt: serverTimestamp()
                } )
            }

           setInput("")

        } catch (error) {
            console.log(error)
        }

    }


  return (
    
    <div className="personal-chat-wrapper h-screen bg-black relative overflow-auto  py-10">


        <div className='border-b-2 border-gray-400  bg-black flex flex-row w-full justify-between items-center p-2 z-10 fixed top-[0%]  '>
             <i  onClick={()=>navigate("/chat/chat-room/")} class="fa-solid fa-arrow-left justify-self-start text-white text-3xl ml-4 "></i>


             <div className='flex flex-row justify-end   items-center gap-2'>

     
                 <p className='border-b-2 border-white text-white '>
                 {recipientInfo[0]?.name}
                     </p>

                 <div> <img src={recipientInfo[0]?.photo} alt="" className='w-[4rem] rounded-[100%] object-contain ' />    </div>
                
            </div>
        </div>

        <div className='personal-chat-messages text-white flex gap-4 items-start flex-col p-4 mt-14 '>

            {
                fullChatArr?.map( (chat,index)=>{


                    const chatTime = chat?.createdAt?.toDate();


                    // Extract the hours and minutes
                    const hours = chatTime?.getHours() ;
                    const minutes = chatTime?.getMinutes().toString().padStart(2, '0') 

                     // Combine hours and minutes to display time as HH:MM
                    const formattedTime = `${hours}:${minutes}`;


                  return  <span key={index}  ref={ 
                    index==fullChatArr.length-1?lastMessageRef:null} className={ `${chat.senderID==user.uid? 'self-end':'self-start'}  inline border-2 rounded-l-3xl rounded-br-none rounded-r- rounded-t-3xl rou  border-gray-200 p-2 px-7 `} >

                        <aside className='text-sm inline-block'>{chat.senderID==user.uid? `You`:chat.senderName} </aside>

                        <p className='text-2xl'> {chat.text}</p> 
                        <aside className='text-sm inline-block' >{formattedTime&&formattedTime}</aside>

                    </span>
                })


            }

        </div>

        <div className='bg-black personal-chat-input flex flex-row justify-center   border-none z-10 '>
            <input type="text" placeholder='Send Chat' className='text-center ml-2  p-2 py-3 w-11/12 rounded-2xl ' value={input} onChange={(e)=>setInput(e.target.value)} />

            <div onClick={handleSend}>
            <i class="fa-regular fa-paper-plane text-white text-3xl mx-4 cursor-pointer"></i>
            </div>
        </div> 
    </div>

  )
}

export default PersonalChat