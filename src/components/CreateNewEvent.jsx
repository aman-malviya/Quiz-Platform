import React, {useState, useEffect} from 'react'
import firebaseApp from '../firebase'
import Toast from './Toast';

export default function CreateNewEvent(props){
    
    //Admin
    const [question,setQuestion] = useState("");
    const [a,setA] = useState("");
    const [b,setB] = useState("");
    const [c,setC] = useState("");
    const [d,setD] = useState("");
    const [ans,setAns] = useState("");
    const [toast, setToast]=useState("");
    const [id, setid] = useState("")
    const [count, setcount] = useState(0)
    const [quizcreated, setquizcreated] = useState(false)
    
    const addQuestion=(event)=>{
        firebaseApp.firestore().collection("Quizzes/"+id+"/Questions").onSnapshot(snapshot=>{
            if(snapshot){
                setcount(snapshot.size)
            }
        })
        if(count >= noOfQues-1){
            setquizcreated(true)
            let inps=document.getElementsByClassName('schedule');
            for(let i=0; i<inps.length; i++){
                inps[i].readOnly=false;
            }
            document.getElementsByClassName("schedule-btn")[0].disabled=false;
            document.getElementById("questionsPush").classList.add('d-none');
            setQuiz("")
            setNoOfQues("")
            setDate("")
            setStartTime("")
            setEndTime("")
            setTime("")
            setToast(<Toast msg="Quiz successfully created" success="true"/>)
            setcount(0)
        }
        event.preventDefault();
        if(question==="" || a==="" || b==="" || c==="" || d==="" || ans===""){
           setToast(<Toast msg="Fill out all the fields first"/>)
            setTimeout(() => {
                setToast(null);
            }, 2000);
        }else{
              firebaseApp.firestore().collection('Quizzes/'+id+"/Questions").doc().set({
                question: question,
                A: a,
                B: b,
                C: c,
                D: d,
                ans:ans,
            }).then(()=>{
                if(!quizcreated){
                    setToast(<Toast success="true" msg="Successfully added to the database."/>);
                }
                setQuestion("");
                setA("");
                setB("");
                setC("");
                setD("");
            }).catch((e)=>{
                setToast(<Toast msg={e.message}/>)
            })

            setTimeout(() => {
                setToast(null);
            }, 3000);
        }
    }
    //Scheduler
    const [quiz, setQuiz] =useState("")
    const [startTime, setStartTime] =useState("")
    const [endTime, setEndTime] =useState("")
    const [date, setDate] =useState("")
    const [noOfQues, setNoOfQues] =useState("")
    const [time, setTime]=useState()
    const [loading, setloading] = useState(false)
    const handleSchedule=()=>{
        setloading(true)
        const year=date.split("-")[0];
        const month=date.split("-")[1];
        const day=date.split("-")[2];
        const startHours=startTime.split(":")[0];
        const startMinutes=startTime.split(":")[1];
        const endHours=endTime.split(":")[0];
        const endMinutes=endTime.split(":")[1];

        if(quiz==="" || noOfQues===0 || startTime==="" || endTime==="" || time===0 || date===""){
            setToast(<Toast msg="Fill out all the fields first"/>)
            setTimeout(() => {
                setToast(null);
            }, 3000);
            setloading(false)
        }else{
            firebaseApp.firestore().collection("Quizzes").add({
                quizName:quiz,
                organizer:props.user.email,
                date:date,
                startTime:startTime,
                endTime:endTime,
                noOfQues:noOfQues,
                timeStampStart:new Date(year, month-1, day, startHours, startMinutes, 0, 0).getTime(),
                timeStampEnd:new Date(year, month-1, day, endHours, endMinutes, 0, 0).getTime(),
                timeDuration:time
            }).then((docRef)=>{
                let inps=document.getElementsByClassName('schedule');
                for(let i=0; i<inps.length; i++){
                    inps[i].readOnly=true;
                }
                document.getElementsByClassName("schedule-btn")[0].disabled=true;
                document.getElementById("questionsPush").classList.remove('d-none');
                setid(docRef.id);
                //Upload image
                let img=document.getElementById("photo").files[0];
                var metadata = {
                    contentType: img.type,
                };
                firebaseApp.storage().ref().child('images/'+docRef.id).put(img, metadata).then((snapshot)=>{
                    setloading(false);
                })
            }).catch((error)=>{
                setToast(<Toast msg={error.message}/>)
                setTimeout(() => {
                    setToast(null)
                }, 3000);
                setloading(false)
            })
        }
    }

    
    useEffect(()=>{
        
    },[count, noOfQues])

    return(<div>
	        <div>
                <h1 className="mb-5">Create an event</h1>
                <div className="row no-gutters">
                    <div className="col-lg-5 mb-5">
                        <h5 className="pb-4 text-center text-dark">Quiz Details</h5>
                        <input className="form-control text-input py-3 shadow bg-transparent rounded-top schedule" value={quiz} onChange={event=>setQuiz(event.target.value)} type="text" placeholder="Quiz Name" required />
                        <input className="form-control text-input py-3 shadow bg-transparent schedule" value={noOfQues} onChange={event=>setNoOfQues(event.target.value)} type="number" placeholder="Number of Questions" required />
                        <input className="form-control text-input py-3 shadow bg-transparent schedule" value={date} onChange={event=>setDate(event.target.value)} type="text" placeholder="Date for the Quiz" required onFocus={e=>e.target.type='date'} />
                        <input className="form-control text-input py-3 shadow bg-transparent schedule" value={startTime} onChange={event=>setStartTime(event.target.value)} type="text" placeholder="Quiz opens at" required onFocus={e=>e.target.type='time'} />
                        <input className="form-control text-input py-3 shadow bg-transparent schedule" value={endTime} onChange={event=>setEndTime(event.target.value)} type="text" placeholder="Quiz closes at" required onFocus={e=>e.target.type='time'} />
                        <input className="form-control text-input py-3 shadow bg-transparent schedule" value={time} onChange={event=>setTime(event.target.value)} type="number" placeholder="Duration of Quiz in minutes" required />
                        <input id="photo" data-bs-toggle="tooltip" data-bs-placement="top" title="Upload an image relevant to your quiz" type="file" className="form-control text-input" aria-label="Upload"></input>
                        <button className="rounded-bottom btn w-100 my-btn text-white py-2 shadow schedule-btn" onClick={handleSchedule}>
                            {loading?
                                <div class="spinner-border text-light" role="status"></div>
                                :
                                "Submit"
                            }
                        </button>
                    </div>
                    <div id="questionsPush" className="offset-lg-1 col-lg-6 d-none">
                        <h5 className="pb-4 text-center text-dark">Question {count}/{noOfQues}</h5>
                        <textarea className="form-control text-input py-3 shadow bg-transparent rounded-top" required value={question} onChange={event=>setQuestion(event.target.value)} type="text" placeholder="Question" />
                        <input className="form-control text-input py-3 shadow bg-transparent" required value ={a} onChange={(event)=>setA(event.target.value)} type="text" placeholder="Option 1" />
                        <input className="form-control text-input py-3 shadow bg-transparent" required value={b} onChange={(event)=>setB(event.target.value)} type="text" placeholder="Option 2" />
                        <input className="form-control text-input py-3 shadow bg-transparent" required value={c} onChange={(event)=>setC(event.target.value)} type="text" placeholder="Option 3" />
                        <input className="form-control text-input py-3 shadow bg-transparent" required value={d} onChange={(event)=>setD(event.target.value)} type="text" placeholder="Option 4" />
                        <select className="form-control text-input py-3 shadow bg-transparent" required onClick={e=>setAns(e.target.value)}>
                            <option value="">Select the correct option</option> 
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                        <button className="rounded-bottom btn w-100 my-btn text-white py-2 shadow" onClick={addQuestion}>Push to the Database</button>
                    </div>
                </div>
                <span style={{'position':'absolute', 'bottom':'20px', 'right':'20px'}}>{toast}</span>
            </div>
		</div>
        );
}