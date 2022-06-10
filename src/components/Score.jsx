import React, {useState, useEffect} from 'react'
import firebaseApp from '../firebase'
import {useHistory, useParams} from "react-router-dom"
import Loader from './Loader';
import { useAuth } from '../Contexts/AuthContext';

export default function Score(){
    const [loading, setLoading]=useState(true);

    const history =useHistory();
    window.addEventListener("popstate", e=>{
        history.push("/");
    })
    const {id} = useParams();
    const [quiz, setquiz] = useState({})
    const [result, setresult] = useState({})
    const {currentUser}=useAuth()

    useEffect(()=>{
        sessionStorage.removeItem("submitTime")
        firebaseApp.firestore().collection("Users/"+currentUser.email+"/AttendedQuizzes").doc(id).get().then((doc)=>{
            setresult(doc.data());
            firebaseApp.firestore().collection("Quizzes").doc(doc.data().quizID).get().then((q)=>{
                setquiz(q.data())
            })
        }).then((doc)=>{
            setLoading(false)
        })
    })

    return (loading?
        <Loader />
        :
        <div className="row g-0 min-vh-100">
        <div className="d-flex justify-content-center align-items-center p-5 text-dark col-lg-4 col-md-5 text-center">
            <div>
                <h3>Congrats {result.name && result.name.split(" ")[0]} !</h3>
                <p>You just completed {quiz.quizName} quiz.</p>
                <div className="text-center">
                    <i class="fas fa-medal fa-4x accent rounded-circle shadow p-4 my-border"></i>
                </div>

                <p className="p-0 m-0 mt-4">You scored</p>
                <div className="py-2 rounded shadow my-border">
                    <h4 className="text-center">{result.score}</h4>
                </div>
                <p className="p-0 m-0 mb-4">out of {quiz.noOfQues*quiz.positive}</p>
                <button onClick={e=>history.push("/")} className="my-btn btn mx-auto shadow text-white rounded my-3">Complete</button>
            </div>
        </div>
        <div style={{'background':'url("/victory.jpg")'}} className="col-lg-8 col-md-7 sideImg d-none d-lg-block d-md-block">
            <div class="shade">
            
            </div>
        </div>
   </div>
   )
}