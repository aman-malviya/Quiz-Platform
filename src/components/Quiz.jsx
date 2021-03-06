import React, {useState, useEffect} from 'react'
import Timer from './Timer'
import firebaseApp from '../firebase'
import { useHistory, useParams } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'
import Loader from './Loader'

function Quiz() {
    const [questions, setQuestions]=useState([])
    const [index, setIndex]=useState()
    const [totalQues, setTotalQues]=useState(0)
    const {id} =useParams()
    const {currentUser} =useAuth()
    const [loading, setloading] = useState(true)
    const history=useHistory()
    const [currentQuiz, setCurrentQuiz]=useState({})
    const [attendee, setattendee] = useState({})
    const [response, setResponse]=useState(new Array(totalQues))

    useEffect(()=>{
        firebaseApp.firestore().collection("Users").doc(currentUser.email).get().then(doc=>{
            let temp={
                Name:doc.data().firstName+" "+doc.data().lastName,
                Email:doc.data().email,
                MobileNumber:doc.data().mobileNumber,
                College:doc.data().college,
                City:doc.data().city,
                State:doc.data().state,
                Image:doc.data().photoURL
            }
            setattendee(temp)
        })
    },[currentUser])
    useEffect(()=>{
        firebaseApp.firestore().collection("Quizzes").doc(id).get().then(doc=>{
            setCurrentQuiz(doc.data())
        })
        firebaseApp.firestore().collection('Quizzes/'+id+'/Questions').get().then(docs=>{
          let temp=[]
          docs.forEach(doc=>{
            temp.push(doc.data())
          })
          setQuestions(temp)
          setTotalQues(docs.size)
        }).then(()=>{
            setIndex(0)
            setloading(false)
        })
    },[id])

    useEffect(()=>{
        if(response[index]){
            document.getElementById(response[index]).style.border="2px solid rgba(69, 123, 157,0.7)";
        }
    },[index, response])

    const next=(e)=>{
        e.preventDefault();
        if(index < totalQues-1){
            const selects=document.getElementsByClassName("select");
            for(let i=0; i<selects.length; i++){
                selects[i].style.border="0"
            }
            setIndex(index+1);
        }
    }

    
    const previous=(e)=>{
        e.preventDefault();
        if(index >= 1){
            const selects=document.getElementsByClassName("select");
            for(let i=0; i<selects.length; i++){
                selects[i].style.border="0"
            }
            setIndex(index-1)
        }
    }

    const handleSelection=(e)=>{
        e.preventDefault();
        response[index]=e.target.value;
        setResponse(response);
        const selects=document.getElementsByClassName("select");
        for(let i=0; i<selects.length; i++){
            selects[i].style.border="0"
        }
        e.target.style.border="2px solid rgba(69, 123, 157,0.7)";
    }

    const submitTest=(e)=>{
        if(e){
            e.preventDefault();
        }
        setloading(true)
        let score=0;

        for(let i=0; i<totalQues; i++){
            if(response[i] === "")continue;
            if(questions[i].ans === response[i]){
                score+=currentQuiz.positive;
            }else{
                score-=currentQuiz.negative;
            }
        }

        firebaseApp.firestore().collection("Users/"+currentUser.email+"/AttendedQuizzes").add({
            score:score,
            quizID:id,
            quizDetails:currentQuiz,
            time:new Date()
          }).then((docRef)=>{
              firebaseApp.firestore().collection("Quizzes/"+id+"/Attendees").add({
                attendeeDetails:attendee,
                attendeeScore:score,
                time:new Date()
              }).then(()=>{
                  history.push("/score/"+docRef.id);
                  setloading(false);
              })
          })
    }

    return (loading?
        <Loader />
        :
        <div className="min-vh-100">
            {/*Appbar*/}
            <div style={{'justifyContent':'space-between'}} className="d-flex px-3 py-2">
                <div className="grid-item d-flex align-items-center">
                    <h2 className="d-inline text-dark">Quiz</h2>
                </div>
            <div className="grid-item">
                <div className="d-flex justify-content-center d-inline">
                    <img alt="timer-img" height="40px" width="40px" src="/timer.png" />
                </div>
                    <Timer func={submitTest} style={{'display':'flex', 'justifyContent':'center'}} />
                </div>
                <div className="grid-item d-flex align-items-center">
                    <button onClick={submitTest} className="accent btn fs-6 p-0">SUBMIT</button>
                </div>
            </div>
            {/*Appbar*/}

            <div style={{'background':'url("'+currentQuiz.banner+'")'}} className="sideImg position-relative">
                <div className="blue d-flex justify-content-center align-items-center text-white p-5 pb-0">
                    <div style={{'display':'flex', 'flexDirection':'column', 'alignItems':'center'}}>
                        <p style={{'fontSize':'0.9rem', 'opacity':'0.75'}} className="text-center">Question {index+1}/{totalQues}</p>
                        <h3 className="mb-5">{questions[index]&&questions[index].question}</h3>
                        {questions[index].banner?
                            <div className="mb-5 rounded-3 box-shadow-card" style={{'width':window.innerWidth<700?'90%':'50%', 'overflow':'hidden'}}>
                                <img src={questions[index].banner} alt="Question" width="100%" />
                            </div>
                            :
                            <div></div>
                        }
                    </div>
                </div>
            </div>
            <div className="mx-auto choices shadow m-2">
                <button onClick={handleSelection} id="A" value="A" className="btn w-100 p-3 select rounded-top">{questions[index]&&questions[index].A}</button>
                <button onClick={handleSelection} id="B" value="B" className="btn w-100 p-3 select">{questions[index]&&questions[index].B}</button>
                <button onClick={handleSelection} id="C" value="C" className="btn w-100 p-3 select">{questions[index]&&questions[index].C}</button>
                <button onClick={handleSelection} id="D" value="D" className="btn w-100 p-3 select rounded-bottom rounded-0">{questions[index]&&questions[index].D}</button>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <button onClick={previous} className="border-0  bg-white py-2 px-3 accent shadow rounded-circle mx-2 "><i class="fas fa-chevron-left"></i></button>
                <button onClick={next} className="border-0  bg-white py-2 px-3 accent shadow rounded-circle mx-2 "><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    )
}

export default Quiz
