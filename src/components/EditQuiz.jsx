import { sort } from 'cli-table';
import React, {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import firebaseApp from '../firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';


const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#0d1842cc'
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2, 4, 3),
      borderRadius:'8px',
      width:window.innerWidth<700?"90vw":"50vw",
      overflow:"scroll",
      maxHeight:"95vh"
    },
}));

function EditQuiz() {

    const {id} = useParams();
    const [quiz, setQuiz]=useState({})
    const [questions, setQuestions]=useState([])
    const [loading, setloading] = useState(false)

    //Edit quiz details
    const [quizID, setquizID] = useState("")
    const [quizName, setQuizName] =useState("")
    const [startTime, setStartTime] =useState("")
    const [endTime, setEndTime] =useState("")
    const [date, setDate] =useState("")
    const [noOfQues, setNoOfQues] =useState("")
    const [time, setTime]=useState()
    const [flag, setflag] = useState(true)
    const [refetch, setrefetch] = useState(true)
    const [index, setindex] = useState(0)
    //Edit Questions
    const [question,setQuestion] = useState("");
    const [a,setA] = useState("");
    const [b,setB] = useState("");
    const [c,setC] = useState("");
    const [d,setD] = useState("");
    const [ans,setAns] = useState("");
    const [toast, setToast]=useState("");


    useEffect(()=>{
        firebaseApp.firestore().collection("Quizzes").doc(id).get().then(doc=>{
            setquizID(doc.id)
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
                    id:doc.id
                })
            })
            temp.sort((a,b)=>{
                return a.Question.length - b.Question.length;
            })
            setQuestions(temp);
        })
    }, [refetch])

    //Modal
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = (e) => {
        let ind=e.target.id;
        if(!ind){
            ind=e.target.parentNode.id;
        }
        let curr = questions[parseInt(ind)];
        if(ind === "none"){
            setflag(true)
        }else{
            setindex(parseInt(ind))
            setflag(false)
            setQuestion(curr.Question)
            setA(curr.OptionA)
            setB(curr.OptionB)
            setC(curr.OptionC)
            setD(curr.OptionD)
            setAns(curr.CorrectOption)
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
            setrefetch(!refetch);
            handleClose();
        })

    }
    const saveQuestion=(e)=>{
        e.preventDefault();
        const qid=questions[index].id
        firebaseApp.firestore().collection("Quizzes").doc(quizID).collection("Questions").doc(qid).update({
            question: question,
            A: a,
            B: b,
            C: c,
            D: d,
            ans:ans,
        }).then(()=>{
            setrefetch(!refetch);
            handleClose();
        })
    }

    return (
        <div className="p-5">
            {/*Modal*/}
            <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div className={classes.paper}>
                            {flag?
                                <div>
                                    <br />
                                    <div className='d-flex justify-content-between w-100'>
                                        <h5 id="transition-modal-title">Quiz Details</h5>
                                        <i style={{'cursor':'pointer'}} onClick={handleClose} class="fal fa-times-circle text-muted fs-3"></i>
                                    </div>
                                    <br />  
                                    <label><strong>Quiz Name</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={quizName} onChange={(e)=>setQuizName(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Your Name" />   
                                    </div>
                                    <br />
                                    <label><strong>Date</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={date} onChange={(e)=>setDate(e.target.value)} type="date" className="form-control border-0 py-2 px-4" placeholder="Enter Your Email" />   
                                    </div>
                                    <br />
                                    <label><strong>Start Time</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={startTime} onChange={(e)=>setStartTime(e.target.value)} type="time" className="form-control border-0 py-2 px-4" placeholder="Enter Your Mobile Number" />   
                                    </div>
                                    <br />
                                    <label><strong>End Time</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={endTime} onChange={(e)=>setEndTime(e.target.value)} type="time" className="form-control border-0 py-2 px-4" placeholder="Enter the Name of Current College" />   
                                    </div>
                                    <br />
                                    <label><strong>Duration (in minutes)</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={time} onChange={(e)=>setTime(e.target.value)} type="number" className="form-control border-0 py-2 px-4" placeholder="Enter the Name of Current College" />   
                                    </div>
                                    <br />
                                    <label><strong>Number of Questions</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={noOfQues} onChange={(e)=>setNoOfQues(e.target.value)} type="number" className="form-control border-0 py-2 px-4" placeholder="Enter the Name of Current College" />   
                                    </div>
                                    <br />
                                    <button onClick={saveQuiz} style={{'backgroundColor':'#0d1842', 'color':'#fff'}} className="btn shadow py-2 px-4">Save</button>
                                    <br />
                                </div>
                                :
                                <div>
                                    <br />
                                    <div className='d-flex justify-content-between w-100'>
                                        <h5 id="transition-modal-title">Question</h5>
                                        <i style={{'cursor':'pointer'}} onClick={handleClose} class="fal fa-times-circle text-muted fs-3"></i>
                                    </div>
                                    <br />  
                                    <label><strong>Question</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={question} onChange={(e)=>setQuestion(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter the Question" />   
                                    </div>
                                    <br />
                                    <label><strong>Option A</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={a} onChange={(e)=>setA(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Option A" />   
                                    </div>
                                    <br />
                                    <label><strong>Option B</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={b} onChange={(e)=>setB(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Option B" />   
                                    </div>
                                    <br />
                                    <label><strong>Option C</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={c} onChange={(e)=>setC(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Option C" />   
                                    </div>
                                    <br />
                                    <label><strong>Option D</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <input value={d} onChange={(e)=>setD(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Option D" />   
                                    </div>
                                    <br />
                                    <label><strong>Answer</strong></label>
                                    <div class="input-group my-2 shadow rounded-2">
                                        <select className="form-select" value={ans} onChange={(e)=>setAns(e.target.value)}>
                                            <option value="">Select an option</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                        </select>   
                                    </div>
                                    <br />
                                    <button onClick={saveQuestion} style={{'backgroundColor':'#0d1842', 'color':'#fff'}} className="btn shadow py-2 px-4">Save</button>
                                    <br />
                                </div>
                            }
                        </div>
                    </Fade>
            </Modal>
            <div className="d-flex align-items-center">
                <div className="shadow-lg rounded-pill d-inline py-2 px-3 d-flex">
                    <Link to="/"><i class="far fa-arrow-left fs-4"></i></Link>
                    <h5 className="m-0 p-0 px-5">{quizName}</h5>
                </div>
            </div>
            <br />
            <br />
            <div className="d-flex justify-content-center">
                <div className="w-50">
                    <h3>Quiz Details</h3>
                    <br />
                    <div className="p-4 box-shadow-card rounded-3 row position-relative">
                        <span id="none" onClick={handleOpen} className="edit-icon p-4"><i class="fal fa-pen fs-5"></i></span>
                        <div className="col-lg-6">
                            <p><strong>Quiz Name</strong></p>
                            <h6>{quizName}</h6>
                            <br />
                            <p><strong>Date</strong></p>
                            <h6>{date}</h6>
                            <br />
                            <p><strong>Time</strong></p>
                            <h6>{startTime} to {endTime}</h6>
                        </div>
                        <div className="col-lg-6">
                            <p><strong>Duration</strong></p>
                            <h6>{time} minutes</h6>
                            <br />
                            <p><strong>Number of Questions</strong></p>
                            <h6>{noOfQues}</h6>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div>
                <h3>Questions</h3>
                <br />
                <div className="row g-3">
                    {questions.map((q,i)=>{
                        return <div className="col-lg-3 col-md-4 col-sm-6 px-2 position-relative">
                            <span id={i} onClick={handleOpen} className="edit-icon p-4 bg-none"><i class="fal fa-pen fs-5"></i></span>
                            <div className="p-5 box-shadow-card rounded-3">{q.Question}</div> 
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default EditQuiz
