import React, {useEffect, useState} from 'react'
import firebaseApp from '../firebase'
import {useAuth} from '../Contexts/AuthContext'
import ResultCard from './ResultCard'
import {useHistory} from 'react-router-dom'
import Loader from './Loader'

export default function Dashboard(props){
    const name=props.user.displayName && props.user.displayName.split(" ")[0];
    const {currentUser} = useAuth();
    const [quizzesAttended, setquizzesAttended] = useState([])
    const [quizzesOrganized, setquizzesOrganized] = useState([])
    const [loading, setloading] = useState(true)
    const history=useHistory()
    useEffect(()=>{
        firebaseApp.firestore().collection("Users/"+currentUser.email+"/AttendedQuizzes").get().then(docs=>{
            let temp=[]
            docs.forEach(doc=>{
                temp.push(doc.data())
            })
            setquizzesAttended(temp)

            firebaseApp.firestore().collection("Quizzes").where("organizer", "==", currentUser.email).get().then(docs=>{
                let temp=[]
                docs.forEach(doc=>{
                    temp.push([doc.id,doc.data()])
                })
                setquizzesOrganized(temp)
                setloading(false)
            })
        })
    },[])

    const newQuiz=()=>{
        firebaseApp.firestore().collection("Quizzes").add({
            quizName:"Untitled",
            organizer:currentUser.email
        }).then(ref=>{
            history.push('/edit/'+ref.id)
        })
    }

    return(loading?
        <Loader />
        :
        <div>
            <h1 className="mb-5">Hello {name} !</h1>
            <div id="attended" className="p-3 rounded">
                <h5 className="pb-4 text-dark">Quizzes Attended</h5>
                <div className="row no-gutters">
                    {quizzesAttended.map(quiz=>{
                        return <div className="col-lg-6">
                            <ResultCard id={quiz.quizID} title={quiz.quizDetails.quizName} score={quiz.score} maxScore={quiz.quizDetails.noOfQues} banner={quiz.quizDetails.banner} />
                        </div>
                    })}
                </div>
            </div>
            <div id="organized" className="p-3 rounded">
                <div className="d-flex">
                    <h5 className="mb-4 py-0 text-dark me-4">Quizzes Organized</h5>
                    <button onClick={newQuiz} style={{'height':'30px', 'backgroundColor':'#0d1842'}} className="btn text-white py-0 px-3 rounded-pill">New Quiz</button>
                </div>
                <div className="row no-gutters">
                    {quizzesOrganized.map(quiz=>{
                        return <div className="col-lg-6">
                            <ResultCard id={quiz[0]} title={quiz[1].quizName} banner={quiz[1].banner} />
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}
