import React from 'react'

function Loading() {
  return (
   <div className='grid place-items-center bg-black text-white h-screen'>
         <div className='text-6xl'>Loading... 
         <i className="fas fa-sync fa-spin text-6xl"></i>

         </div>
   </div>
  )
}

export default Loading