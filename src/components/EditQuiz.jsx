import React, {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import firebaseApp from '../firebase';

function EditQuiz() {

    const {id} = useParams();
    const [quiz, setQuiz]=useState({})
    const [questions, setQuestions]=useState([])
    const [loading, setloading] = useState(false)

    //Edit quiz details
    const [quizName, setQuizName] =useState("")
    const [startTime, setStartTime] =useState("")
    const [endTime, setEndTime] =useState("")
    const [date, setDate] =useState("")
    const [noOfQues, setNoOfQues] =useState("")
    const [time, setTime]=useState()

    //Edit Questions
    const [question,setQuestion] = useState("");
    const [a,setA] = useState("");
    const [b,setB] = useState("");
    const [c,setC] = useState("");
    const [d,setD] = useState("");
    const [ans,setAns] = useState("");
    const [toast, setToast]=useState("");
    const [count, setcount] = useState(0)


    useEffect(()=>{
        firebaseApp.firestore().collection("Quizzes").doc(id).get().then(doc=>{
            setQuiz(doc.data())
            setQuizName(doc.data().quizName);
            setStartTime(doc.data().startTime);
            setEndTime(doc.data().endTime);
            setDate(doc.data().date);
            setNoOfQues(doc.data().noOfQues);
            setTime(doc.data().timeDuration)
        })
        firebaseApp.firestore().collection("Quizzes").doc(id).collection("Questions").onSnapshot(snap=>{
            let temp=[];
            snap.docs.forEach(doc=>{
                temp.push({
                    Question:doc.data().question,
                    OptionA:doc.data().A,
                    OptionB:doc.data().B,
                    OptionC:doc.data().C,
                    OptionD:doc.data().D,
                    CorrectOption:doc.data().ans,
                    QuestionId:doc.id
                })
            })
            setQuestions(temp);
            setcount(count+1);
        })
    }, [])

    useEffect(()=>{
        if(questions.length){
            setQuestion(questions[count-1].Question);
            setA(questions[count-1].OptionA);
            setB(questions[count-1].OptionB);
            setC(questions[count-1].OptionC);
            setD(questions[count-1].OptionD);
            setAns(questions[count-1].CorrectOption);
        }
    }, [count])

    const saveQuiz=(e)=>{
        e.preventDefault();
        const year=date.split("-")[0];
        const month=date.split("-")[1];
        const day=date.split("-")[2];
        const startHours=startTime.split(":")[0];
        const startMinutes=startTime.split(":")[1];
        const endHours=endTime.split(":")[0];
        const endMinutes=endTime.split(":")[1];
        firebaseApp.firestore().collection("Quizzes").doc(id).update({
            quizName:quizName,
            date:date,
            startTime:startTime,
            endTime:endTime,
            noOfQues:noOfQues,
            timeStampStart:new Date(year, month-1, day, startHours, startMinutes, 0, 0).getTime(),
            timeStampEnd:new Date(year, month-1, day, endHours, endMinutes, 0, 0).getTime(),
            timeDuration:time
        }).then(()=>{
            console.log("Saved");
        })

    }
    const saveQuestion=(e)=>{
        e.preventDefault();
        firebaseApp.firestore().collection("Quizzes").doc(id).collection("Questions").doc(questions[count].QuestionId).update({
            question: question,
            A: a,
            B: b,
            C: c,
            D: d,
            ans:ans,
        }).then(()=>{
            console.log("Saved");
        })
    }

    return (
        <div className="p-5">
            <div className="d-flex align-items-center">
                <div className="shadow-lg rounded-pill d-inline py-2 px-3 d-flex">
                    <Link to="/"><i class="far fa-arrow-left fs-4"></i></Link>
                    <h5 className="m-0 p-0 px-5">{quizName}</h5>
                </div>
            </div>
            <br />
            <br />
            <div className="row no-gutters">
                <div className="col-lg-5 mb-5">
                    <h5 className="pb-4 text-center text-dark">Quiz Details</h5>
                    <input className="form-control text-input py-3 shadow bg-transparent rounded-top schedule" value={quizName} onChange={event=>setQuizName(event.target.value)} type="text" placeholder="Quiz Name" required />
                    <input className="form-control text-input py-3 shadow bg-transparent schedule" value={noOfQues} onChange={event=>setNoOfQues(event.target.value)} type="number" placeholder="Number of Questions" required />
                    <input className="form-control text-input py-3 shadow bg-transparent schedule" value={date} onChange={event=>setDate(event.target.value)} type="text" placeholder="Date for the Quiz" required onFocus={e=>e.target.type='date'} />
                    <input className="form-control text-input py-3 shadow bg-transparent schedule" value={startTime} onChange={event=>setStartTime(event.target.value)} type="text" placeholder="Quiz opens at" required onFocus={e=>e.target.type='time'} />
                    <input className="form-control text-input py-3 shadow bg-transparent schedule" value={endTime} onChange={event=>setEndTime(event.target.value)} type="text" placeholder="Quiz closes at" required onFocus={e=>e.target.type='time'} />
                    <input className="form-control text-input py-3 shadow bg-transparent schedule" value={time} onChange={event=>setTime(event.target.value)} type="number" placeholder="Duration of Quiz in minutes" required />
                    <input id="photo" data-bs-toggle="tooltip" data-bs-placement="top" title="Upload an image relevant to your quiz" type="file" className="form-control text-input" aria-label="Upload"></input>
                    <button onClick={saveQuiz} className="rounded-bottom btn w-100 my-btn text-white py-2 shadow schedule-btn">
                        {loading?
                            <div class="spinner-border text-light" role="status"></div>
                            :
                            "Save"
                        }
                    </button>
                </div>
                <div id="questionsPush" className="offset-lg-1 col-lg-6">
                    <h5 className="pb-4 text-center text-dark">Question {count}/{quiz.noOfQues}</h5>
                    <textarea className="form-control text-input py-3 shadow bg-transparent rounded-top" required value={question} onChange={event=>setQuestion(event.target.value)} type="text" placeholder="Question" />
                    <input className="form-control text-input py-3 shadow bg-transparent" required value ={a} onChange={(event)=>setA(event.target.value)} type="text" placeholder="Option 1" />
                    <input className="form-control text-input py-3 shadow bg-transparent" required value={b} onChange={(event)=>setB(event.target.value)} type="text" placeholder="Option 2" />
                    <input className="form-control text-input py-3 shadow bg-transparent" required value={c} onChange={(event)=>setC(event.target.value)} type="text" placeholder="Option 3" />
                    <input className="form-control text-input py-3 shadow bg-transparent" required value={d} onChange={(event)=>setD(event.target.value)} type="text" placeholder="Option 4" />
                    <select value={ans} className="form-control text-input py-3 shadow bg-transparent" required onChange={e=>setAns(e.target.value)}>
                        <option value="">Select the correct option</option> 
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                    <div className="shadow" style={{'display':'grid', 'gridTemplateColumns':'1fr 3fr 1fr', 'gridGap':'3px', 'borderRadius':'0 0 5px 5px', 'overflow':'hidden'}}>
                        <button onClick={(e)=>{
                            if(count>=2){
                                setcount(count-1);
                            }
                        }} className="btn w-100 my-btn text-white py-2">Prev</button>
                        <button onClick={saveQuestion} className="btn w-100 my-btn text-white py-2">Save</button>
                        <button onClick={(e)=>{
                            if(count < noOfQues){
                                setcount(count+1);
                            }
                        }} className="btn w-100 my-btn text-white py-2">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditQuiz
