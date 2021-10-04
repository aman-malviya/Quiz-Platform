import React, { useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom'
import firebaseApp from '../firebase'

export default function EventCard(props){
    const history=useHistory()
    const startQuiz=()=>{
        sessionStorage.setItem("submitTime", new Date().getTime()+props.duration*60*1000+2000)
        history.push("/quiz/"+props.id);
    }

    return(
        <div style={{'backgroundColor':'#fbfdff'}} class="card box-shadow-card mb-4">
            <div style={{'background':'url("'+props.banner+'")'}} className="sideImg">
                <div className="blue py-5 w-100">
                <br /><br /><br /><br />
                <div className="d-flex justify-content-center">
                    <button disabled={props.disabled === "true"} onClick={startQuiz} class="btn text-white quiz-btn px-5 py-2">{props.disabled === "true"?"Upcoming":"Join"}</button>
                </div>
                <br /><br /><br /><br />
                </div>
            </div>
            <div class="card-body">
                <h5 class="card-title">{props.title}</h5>
                <p style={{'fontSize':'0.7rem'}} class="card-text">
                    Date : {props.date}<br/>
                    Time : {props.start} to {props.end}<br/>
                    Number of Questions : {props.noOfQues}<br />
                    Duration of Quiz : {props.duration} minutes
                </p>
            </div>
        </div>
    )
}