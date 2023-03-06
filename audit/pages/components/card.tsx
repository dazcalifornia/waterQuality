import {useEffect, useState} from'react'
import StatusCard from './status'

export default function Card(){
  return (
      <div className="container">
       <div className="feed">
         <div className='avatar'></div>
         <div className="tweet">
           <h1>Activity in order</h1>
           <StatusCard status="Active"/>
           <div className="content">
             <div className="text">

             </div>          
           </div>
         </div>
       </div>
     </div> 
  )
}

