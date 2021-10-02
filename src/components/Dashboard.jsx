import React, {useEffect, useState} from 'react'
import firebaseApp from '../firebase'
import {useAuth} from '../Contexts/AuthContext'
import ResultCard from './ResultCard'

export default function Dashboard(props){
    const name=props.user.displayName && props.user.displayName.split(" ")[0];
    const {currentUser} = useAuth();
    const [quizzesAttended, setquizzesAttended] = useState([])
    const [quizzesOrganized, setquizzesOrganized] = useState([])
    useEffect(()=>{
        firebaseApp.firestore().collection("Results").where("username", "==", currentUser.email).get().then(docs=>{
            let temp=[]
            docs.forEach(doc=>{
                temp.push(doc.data())
            })
            setquizzesAttended(temp)
        })
        firebaseApp.firestore().collection("Quizzes").where("organizer", "==", currentUser.email).get().then(docs=>{
            let temp=[]
            docs.forEach(doc=>{
                temp.push([doc.id,doc.data()])
            })
            setquizzesOrganized(temp)
        })
    },[])


    return(
        <div>
            <h1 className="mb-5">Hello {name} !</h1>
            <div id="attended" className="p-3 rounded">
                <h5 className="pb-4 text-dark">Quizzes Attended</h5>
                <div className="row no-gutters">
                    {quizzesAttended.map(quiz=>{
                        return <div className="col-lg-6">
                            <ResultCard id={quiz.quizID} title={quiz.currentQuiz.quizName} score={quiz.score} maxScore={quiz.currentQuiz.noOfQues} />
                        </div>
                    })}
                </div>
            </div>
            <div id="organized" className="p-3 rounded">
                <h5 className="pb-4 text-dark">Quizzes Organized</h5>
                <div className="row no-gutters">
                    {quizzesOrganized.map(quiz=>{
                        return <div className="col-lg-6">
                            <ResultCard id={quiz[0]} title={quiz[1].quizName} />
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}
