import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase-config/firebase-config'
import { collection, doc, onSnapshot, query } from 'firebase/firestore'
import { db } from './firebase-config/firebase-config'
import { where } from 'firebase/firestore'
import { getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { getDoc } from 'firebase/firestore'
import { orderBy } from 'firebase/firestore/lite'


function ChatRoom() {

    const [user] = useAuthState(auth)
    const [finalChatArr, setFinalChatArr]= useState([])
    const [lastMessage,setLastMessage]=useState("")
    const [lastTime,setLastTime]=useState("")
    const [navUID,setNavUID] = useState("")
    const [navUID2,setNavUID2] = useState("")
    const navigate = useNavigate();


    useEffect(()=>{

            async function getAllChats(){

            try {
                const q1= query(
                    collection(db,"messages") ,
                     where("senderUID","==", user.uid ) )
                        
                    let finalQuery =  await getDocs( q1) 
               
                    const chats = finalQuery.docs.map(doc=>{return {...doc.data() , chatRefID:doc.id } } );
                    
                    const q2= query(
                        collection(db,"messages") ,
                          where("recipientUID","==", user.uid )  )
            
            
                        let finalQuery2 = await getDocs(q2) 

                   
                        const chats2 = finalQuery2.docs.map(doc=>{return {...doc.data() , chatRefID:doc.id } } )

        
                    let combinedChats=[...chats,...chats2]

                    setFinalChatArr(combinedChats)
            } catch (error) {
                console.log(error)
            }
            }

            getAllChats()

       
      

    } ,[user])


    async function displayLastMessage( id){
        try {
                            
            let q = query(collection(db,"messages",id, "messageDoc"), orderBy("createdAt") )

            let checkArr;
            onSnapshot(q , (snapshot)=>{

             checkArr=  snapshot.docs.map((doc)=> {return { ...doc.data()  }})


             checkArr.sort((a, b) => {
                 return a.createdAt.seconds - b.createdAt.seconds || a.createdAt.nanoseconds - b.createdAt.nanoseconds;
               });
             
             let lastObj = checkArr[checkArr.length-1]
             let time = lastObj.createdAt
 
             const chatTime = time.toDate();
 
                     // Extract the hours and minutes
                     const hours = chatTime?.getHours() ;
                     const minutes = chatTime?.getMinutes().toString().padStart(2, '0') 
 
                      // Combine hours and minutes to display time as HH:MM
                     const formattedTime = `${hours}:${minutes}`;
 
 
             let message= lastObj.text
             setLastMessage(message)
             setLastTime(formattedTime)
            })

            // get recipientuid for browser navigation

            let docRef = doc(db,"messages",id) 

            let data=  await getDoc(docRef)
            let dataObj = data.data();

            setNavUID(dataObj.recipientUID)
          
            setNavUID2(dataObj.senderUID)

            // goToChat( dataObj.recipientUID, dataObj.senderUID )

        } catch (error) {
            console.log(error)
        }


    }

    function goToChat(id1,id2){

        const id = id1==user.uid? id2:id1
        navigate(`/chat/chat-room/${id}`)
    }

    function goToFindUser () {
        navigate("/chat/find-users")
    }

  return (
    <>
        <div className="chat-room px-4">
            <div className='flex flex-row items-center justify-between '>
                  <h1 className='text-4xl font-semibold mb-4'> Chats </h1> 

                  <aside onClick={goToFindUser} className=' flex flex-row items-center justify-center mb-4 mr-8 w-[4rem] h-[4rem]  text-2xl border-2 p-4 rounded-[100%]' >
                 <i class="fa-solid fa-plus"></i>
                  <i class="fa-regular fa-user"></i>
                 </aside>
            </div>

            <input type="text" className='w-full p-2 rounded-3xl pl-4 text-black'  placeholder="Search Chat"  />

            <div className='mt-8 flex flex-col  gap-4 '>
                
                    { 

                        finalChatArr.map((doc,index)=>{

                            displayLastMessage(doc.chatRefID)




                     return  <section onClick={()=>goToChat(navUID,navUID2)} key={index} className=' flex flex-row pb-2 border-b-2 border-gray-400'>
                   

                              <div className=' pl-4  flex flex-col gap-2 overflow-hidden'>  
                        
                            <span className=' self-start px-2 p-1 rounded-2xl bg-gray-600 font-bold'>{doc.recipientName}</span>

                            <div className='flex flex-row gap-8 ml-2 mt-2 items-center'>

                            <aside className='text-gray-400 font-semibold'>{lastMessage}</aside>
                            <aside className='text-gray-400 '>{lastTime}</aside>

                            </div>

                          </div>
                    
                         </section>
                        })

                    
                    }


               

                

            </div>
        </div>
    </>
  )
}

export default ChatRoom