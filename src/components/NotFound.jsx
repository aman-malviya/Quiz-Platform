import React from 'react'

export default function NotFound(){
    return <div style={{"paddingTop":'140px'}} className="landing-page">
        <div style={{'textAlign':'center', 'color':'#f1faee', 'paddingTop':'5%'}}>
            <h1 style={window.innerWidth>600?{'fontSize':'7rem'}:{'fontSize':'4rem'}}>
                4<img src="sad.png" alt="sad-face-img" width={window.innerWidth>600?"150px":"100px"} height={window.innerWidth>600?"150px":"100px"} />4
                <br />
                <span style={window.innerWidth>600?{'fontSize':'3rem'}:{'fontSize':'2rem'}}>Page Not Found</span>
            </h1>
        </div>
    </div>
}