import React from 'react'
import {useState, useEffect} from 'react'
import firebaseApp from '../firebase'
import EventCard from './EventCard';
import Loader from './Loader';


export default function Events(){

    const [quizzes,setQuizzes]=useState([]);
    const [loading, setloading] = useState(true)
    
    useEffect(()=>{
        firebaseApp.firestore().collection("Quizzes").onSnapshot(snapshot=>{
            setQuizzes(
                snapshot.docs.map(doc=>({
                    doc:doc.data(),
                    id:doc.id
                }))
            )
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
            {quizzes.map(quiz=>{
                if(quiz.doc.timeStampStart > new Date().getTime() || quiz.doc.timeStampEnd < new Date().getTime()){
                    return null;
                }   
                return <div className="col-lg-4">
                    <EventCard id={quiz.id} title={quiz.doc.quizName} date={quiz.doc.date} duration={quiz.doc.timeDuration} start={quiz.doc.startTime} end={quiz.doc.endTime} noOfQues={quiz.doc.noOfQues} banner={quiz.doc.banner} />
                </div>        
            })}
        </div>
        <br />
        <h5>Upcoming Quizzes</h5>
        <div className="row">
            {quizzes.map(quiz=>{
                if(quiz.doc.timeStampStart < new Date().getTime()){
                    return null;
                }   
                return <div className="col-lg-4">
                    <EventCard id={quiz.id} title={quiz.doc.quizName} date={quiz.doc.date} duration={quiz.doc.timeDuration} start={quiz.doc.startTime} end={quiz.doc.endTime} noOfQues={quiz.doc.noOfQues} disabled="true" banner={quiz.doc.banner} />
                </div>        
            })}
        </div>
    </div>)
}