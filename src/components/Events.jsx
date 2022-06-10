import React from 'react'
import {useState, useEffect} from 'react'
import firebaseApp from '../firebase'
import EventCard from './EventCard';
import Loader from './Loader';
import NothingHere from './NothingHere'


export default function Events(){

    const [livequizzes, setlivequizzes] = useState([])
    const [upcomingquizzes, setupcomingquizzes] = useState([])
    const [loading, setloading] = useState(true)
    
    useEffect(()=>{
        firebaseApp.firestore().collection("Quizzes").get().then(docs=>{
            const currTime=new Date().getTime()
            const live=[]
            const upcoming=[]
            docs.forEach(doc=>{
                if(doc.data().published){
                    if(currTime > doc.data().timeStampStart && currTime < doc.data().timeStampEnd){
                        live.push([doc.data(),doc.id])
                    }else if(currTime < doc.data().timeStampStart){
                        upcoming.push([doc.data(), doc.id])
                    }
                }
            })
            setlivequizzes(live)
            setupcomingquizzes(upcoming)
            setloading(false)
        })
    }
    ,[])
    return (loading?
    <Loader />
    :
    <div>
        <h1 className="mb-5">Events</h1>
        <br />
        <h5>Live Quizzes</h5>
        <div className="row">
            {!livequizzes.length?
                <NothingHere />
                :
                <div></div>
            }
            {livequizzes.map(quiz=>{  
                return <div className="col-lg-4">
                    <EventCard id={quiz[1]} title={quiz[0].quizName} date={quiz[0].date} duration={quiz[0].timeDuration} start={quiz[0].startTime} end={quiz[0].endTime} noOfQues={quiz[0].noOfQues} banner={quiz[0].banner} />
                </div>        
            })}
        </div>
        <br />
        <h5>Upcoming Quizzes</h5>
        <div className="row">
            {!upcomingquizzes.length?
                <NothingHere />
                :
                <div></div>
            }
            {upcomingquizzes.map(quiz=>{ 
                return <div className="col-lg-4">
                    <EventCard id={quiz[1]} title={quiz[0].quizName} date={quiz[0].date} duration={quiz[0].timeDuration} start={quiz[0].startTime} end={quiz[0].endTime} noOfQues={quiz[0].noOfQues} disabled="true" banner={quiz[0].banner} />
                </div>        
            })}
        </div>
    </div>)
}