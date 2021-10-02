import React, {useEffect, useState} from "react"
import firebaseApp  from '../firebase'

export default function LeaderBoard(){
    const [points, setPoints]=useState([]);
    useEffect(()=>{
            firebaseApp.firestore().collection("Results").where('quizName','==',sessionStorage.getItem('quizName')).onSnapshot((snapshot)=>{
                let scores=[];
                snapshot.forEach((doc)=>{
                    scores.push(doc.data());
                })
                setPoints(scores);
            })
    },[])
    
    return(<div style={{'padding':'140px 0'}}>
        <div style={{'padding':'10px'}} className="landing-page">
            <div className="score" style={{'display':'grid', 'gridTemplateColumns':'1fr 3fr 1fr', 'margin':'auto', 'backgroundColor':'#1A8BDB', 'border':'none', 'textAlign':'left'}}>
                    <div style={{'textAlign':'center'}}>Rank</div>
                    <div style={{'paddingLeft':"10px"}}>Student</div>
                    <div style={{'textAlign':'center'}}>Points</div>
            </div>
            {points.map((score, i)=>{
                return <div className="score" style={{'display':'grid', 'grid-template-columns':'1fr 3fr 1fr', 'margin':'auto', 'textAlign':'left', 'fontSize':'0.9rem'}}>
                    <div style={{'textAlign':'center'}}>{(i+1)}</div>
                    <div style={{'paddingLeft':"10px"}}>{score.name}</div>
                    <div style={{'textAlign':'center'}}>{score.points}</div>
                </div>
            })}        
        </div>
    </div>)
}