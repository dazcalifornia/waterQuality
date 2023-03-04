import {useEffect, useState} from'react'


export default function Card({post}:any){
  console.log('post:',post)
//  const data = `
//    function greet() {
//      console.log("Hello, world!");
//    }
//    `
  return (
      <div className="container">
      <div className="feed">
        <div className="tweet">
         
          <div className="content">
            <div className="name">Franx</div>
            <div className="username">@Alexis</div>
            <div className="text">
              {post.text}
             {post.image.map((imageUrl:any, index:any) => (
              <img key={index} src={imageUrl} alt={`Image ${index + 1}`} />
            ))}
            </div>
          </div>
        </div>
      </div>
    </div> 
  )
}

