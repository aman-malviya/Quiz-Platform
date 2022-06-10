import React, {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import firebaseApp from '../firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Loader from './Loader';
import ButtonLoader from './ButtonLoader';


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
    const [loading, setloading] = useState(true)
    const [buttonloading, setbuttonloading] = useState(false)

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
    const [positive, setPositive]=useState(0)
    const [negative, setNegative]=useState(0)
    //Edit Questions
    const [question,setQuestion] = useState("");
    const [a,setA] = useState("");
    const [b,setB] = useState("");
    const [c,setC] = useState("");
    const [d,setD] = useState("");
    const [ans,setAns] = useState("");
    const [published, setPublished]=useState(false)
    // const [toast, setToast]=useState("");


    useEffect(()=>{
        firebaseApp.firestore().collection("Quizzes").doc(id).get().then(doc=>{
            setquizID(doc.id)
            setQuiz(doc.data())
            setQuizName(doc.data().quizName);
            setStartTime(doc.data().startTime);
            setEndTime(doc.data().endTime);
            setDate(doc.data().date);
            setTime(doc.data().timeDuration);
            setPublished(doc.data().published)
            setPositive(doc.data().positive)
            setNegative(doc.data().negative)

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
                        id:doc.id,
                        Banner:doc.data().banner
                    })
                })
                temp.sort((a,b)=>{
                    return a.Question.length - b.Question.length;
                })
                setNoOfQues(temp.length)
                firebaseApp.firestore().collection("Quizzes").doc(id).update({
                    noOfQues:noOfQues
                }).then(()=>{
                    setQuestions(temp);
                    setloading(false);
                })
            })
        })
    }, [refetch, id, noOfQues])

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
        setbuttonloading(true)
        const year=date.split("-")[0];
        const month=date.split("-")[1];
        const day=date.split("-")[2];
        const startHours=startTime.split(":")[0];
        const startMinutes=startTime.split(":")[1];
        const endHours=endTime.split(":")[0];
        const endMinutes=endTime.split(":")[1];
        let img=document.getElementById("quiz-banner").files[0]
        firebaseApp.firestore().collection("Quizzes").doc(id).update({
            quizName:quizName,
            date:date,
            startTime:startTime,
            endTime:endTime,
            noOfQues:noOfQues,
            timeStampStart:new Date(year, month-1, day, startHours, startMinutes, 0, 0).getTime(),
            timeStampEnd:new Date(year, month-1, day, endHours, endMinutes, 0, 0).getTime(),
            timeDuration:time,
            published:false,
            positive:positive,
            negative:negative
        }).then(()=>{
            if(img){
                updateQuizBanner(img)
            }else{
                setbuttonloading(false)
                setrefetch(!refetch)
                handleClose()
            }
        })
    }
    const saveQuestion=(e)=>{
        e.preventDefault();
        setbuttonloading(true)
        const qid=questions[index].id
        const img=document.getElementById("question-image").files[0]
        firebaseApp.firestore().collection("Quizzes").doc(quizID).collection("Questions").doc(qid).update({
            question: question,
            A: a,
            B: b,
            C: c,
            D: d,
            ans:ans,
        }).then(()=>{
            if(img){
                updateQuestionImage(img,qid)
            }else{
                setbuttonloading(false)
                setrefetch(!refetch)
                handleClose()
            }
        })
    }
    const newQuestion=()=>{
        setflag(false)
        setQuestion("")
        setA("")
        setB("")
        setC("")
        setD("")
        setAns("")
        firebaseApp.firestore().collection("Quizzes").doc(quizID).collection("Questions").doc().set({
            question:"Untitled"
        }).then(()=>{
            setrefetch(!refetch);
        })
    }
    const updateQuizBanner=(img)=>{
        var metadata={
            contentType:img.type,
        }
        firebaseApp.storage().ref().child("Images/"+id).put(img, metadata)        
        .then((snap)=>{
            firebaseApp.storage().ref().child("Images/"+id).getDownloadURL().then(url=>{
                firebaseApp.firestore().collection("Quizzes").doc(id).update({
                    banner:url
                }).then(()=>{
                    setbuttonloading(false)
                    setrefetch(!refetch)
                    handleClose()
                })
            })
        })
    }
    const updateQuestionImage=(img,qid)=>{
        var metadata={
            contentType:img.type,
        }
        firebaseApp.storage().ref().child("Images/"+qid).put(img, metadata)        
        .then((snap)=>{
            firebaseApp.storage().ref().child("Images/"+qid).getDownloadURL().then(url=>{
                firebaseApp.firestore().collection("Quizzes/"+id+"/Questions").doc(qid).update({
                    banner:url
                }).then(()=>{
                    setbuttonloading(false)
                    setrefetch(!refetch)
                    handleClose()
                })
            })
        })
    }

    const deleteQuestion=(e)=>{
        e.preventDefault()
        const ind=e.target.parentNode.id;
        const id=questions[ind].id

        firebaseApp.firestore().collection("Quizzes/"+quizID+"/Questions").doc(id).delete().then(()=>{
            setrefetch(!refetch)
        })
    }
    const publish=(e)=>{
        e.preventDefault();
        firebaseApp.firestore().collection("Quizzes").doc(id).update({
            published:!published
        }).then(()=>{
            setPublished(!published);
            console.log("done");
        })
    }
    return (loading?
        <Loader />
        :
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
                                    <form onSubmit={saveQuiz}> 
                                        <br />
                                        <div className='d-flex justify-content-between w-100'>
                                            <h5 id="transition-modal-title">Quiz Details</h5>
                                            <i style={{'cursor':'pointer'}} onClick={handleClose} class="fal fa-times-circle text-muted fs-3"></i>
                                        </div>
                                        <br />  
                                        <label><strong>Quiz Name <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={quizName} onChange={(e)=>setQuizName(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Name of the Quiz" />   
                                        </div>
                                        <br />
                                        <label><strong>Quiz Banner</strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input id="quiz-banner" type="file" accept="image/*" className="form-control border-0 py-2 px-4" />   
                                        </div>
                                        <p className="text-muted p-0 m-0">Note: This image will replace your previous banner (if any).</p>
                                        <p className="text-muted">Suggestion: It's good to have a banner for your quiz. Banners attract the audience.</p>
                                        <br />
                                        <label><strong>Date <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={date} onChange={(e)=>setDate(e.target.value)} type="date" className="form-control border-0 py-2 px-4" placeholder="Date of the Quiz" />   
                                        </div>
                                        <br />
                                        <label><strong>Start Time <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={startTime} onChange={(e)=>setStartTime(e.target.value)} type="time" className="form-control border-0 py-2 px-4" placeholder="Quiz starts at" />   
                                        </div>
                                        <br />
                                        <label><strong>End Time <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={endTime} onChange={(e)=>setEndTime(e.target.value)} type="time" className="form-control border-0 py-2 px-4" placeholder="Quiz ends at" />   
                                        </div>
                                        <br />
                                        <label><strong>Duration (in minutes) <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={time} onChange={(e)=>setTime(e.target.value)} type="number" className="form-control border-0 py-2 px-4" placeholder="Duration of the Quiz" />   
                                        </div>
                                        <br />
                                        <label><strong>Points per question <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={positive} min="1" onChange={(e)=>setPositive(e.target.value)} type="number" className="form-control border-0 py-2 px-4" placeholder="Marking" />   
                                        </div>
                                        <br />
                                        <label><strong>Negative Points <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={negative} onChange={(e)=>setNegative(e.target.value)} type="number" className="form-control border-0 py-2 px-4" placeholder="Negative Marking" />   
                                        </div>
                                        <br />
                                        <button type="submit" style={{'backgroundColor':'#0d1842', 'color':'#fff'}} className="btn shadow py-2 px-4">{buttonloading?<ButtonLoader />:"Save"}</button>
                                        <br />
                                    </form>
                                </div>
                                :
                                <div>
                                    <form onSubmit={saveQuestion}>
                                        <br />
                                        <div className='d-flex justify-content-between w-100'>
                                            <h5 id="transition-modal-title">Question {index+1}</h5>
                                            <i style={{'cursor':'pointer'}} onClick={handleClose} class="fal fa-times-circle text-muted fs-3"></i>
                                        </div>
                                        <br />  
                                        <label><strong>Question <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={question} onChange={(e)=>setQuestion(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter the Question" />   
                                        </div>
                                        <br />
                                        <label><strong>Attach an image (optional)</strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input id="question-image" type="file" accept="image/*" className="form-control border-0 py-2 px-4" />   
                                        </div>
                                        <p className="text-muted">Note: This image will replace your previous image (if any).</p>
                                        <br />
                                        <label><strong>Option A <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={a} onChange={(e)=>setA(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Option A" />   
                                        </div>
                                        <br />
                                        <label><strong>Option B <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={b} onChange={(e)=>setB(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Option B" />   
                                        </div>
                                        <br />
                                        <label><strong>Option C <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={c} onChange={(e)=>setC(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Option C" />   
                                        </div>
                                        <br />
                                        <label><strong>Option D <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <input required value={d} onChange={(e)=>setD(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Option D" />   
                                        </div>
                                        <br />
                                        <label><strong>Answer <span className="text-danger">*</span></strong></label>
                                        <div class="input-group my-2 shadow rounded-2">
                                            <select required className="form-select" value={ans} onChange={(e)=>setAns(e.target.value)}>
                                                <option value="">Select an option</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                            </select>   
                                        </div>
                                        <br />
                                        <button type="submit" style={{'backgroundColor':'#0d1842', 'color':'#fff'}} className="btn shadow py-2 px-4">{buttonloading?<ButtonLoader />:"Save"}</button>
                                        <br />
                                    </form>
                                </div>
                            }
                        </div>
                    </Fade>
            </Modal>
            <div className="d-flex align-items-center justify-content-between">
                <div className="shadow-lg rounded-pill d-inline py-2 px-3 d-flex">
                    <Link to="/"><i class="far fa-arrow-left fs-4"></i></Link>
                    <h5 className="m-0 p-0 px-5">{quizName}</h5>
                </div>
                <button style={{'backgroundColor':published?"#e63946":"#0d1842"}} className="btn rounded-pill box-shadow-card px-5 py-2 text-white" onClick={publish}>{published?"Unpublish":"Publish"}</button>
            </div>
            <br />
            <br />
            <div className="d-flex justify-content-center">
                <div style={{'width':window.innerWidth<700?'90%':'75%'}}>
                    <h3>Quiz Details</h3>
                    <br />
                    <div style={{'overflow':'hidden'}} className="box-shadow-card rounded-3 row position-relative g-0">
                        <span id="none" onClick={handleOpen} className="edit-icon p-3"><i style={{'background':window.innerWidth<990?'#fff':'none', 'borderRadius':'50%'}} class="fal fa-pen fs-5 p-2"></i></span>
                        <div className="col-lg-6 d-flex justify-content-center align-items-center">
                            {quiz.banner?
                                <img style={{'objectFit':'cover'}} src={quiz.banner} alt="Quiz Banner" height="100%" width="100%" />
                            :
                                <i class="fal fa-image fa-3x text-muted"></i>
                            }
                        </div>
                        <div className="col-lg-6 p-4 row g-0">
                            <div className="col-lg-6">
                                <p><strong>Quiz Name</strong></p>
                                <h6>{quizName}</h6>
                                <br />
                                <p><strong>Date</strong></p>
                                <h6>{date}</h6>
                                <br />
                                <p><strong>Time</strong></p>
                                <h6>{startTime} to {endTime}</h6>
                                <br />
                                <p><strong>Duration</strong></p>
                                <h6>{time} minutes</h6>
                            </div>
                            <div className="col-lg-6">
                                <p><strong>Number of Questions</strong></p>
                                <h6>{noOfQues}</h6>
                                <br />
                                <p><strong>Marking</strong></p>
                                <h6>{positive}</h6>
                                <br />
                                <p><strong>Negative Marking</strong></p>
                                <h6>{negative}</h6>
                            </div>
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
                        return <div className="col-lg-4 col-md-6 px-2 position-relative h-100">
                            <span style={{'position':'absolute', 'right':'0', 'top':'0'}} id={i} className="bg-none"><i onClick={handleOpen} style={{'cursor':'pointer'}} class="fal fa-pen fs-5 text-primary px-2 py-3"></i> <i onClick={deleteQuestion} style={{'cursor':'pointer'}} class="fal fa-trash fs-5 text-danger py-3 px-2 me-2"></i></span>
                            <div style={{'overflow':'hidden'}} className="box-shadow-card rounded-3 row g-0">
                                <div className="col-5 d-flex justify-content-center align-items-center">
                                    {q.Banner?
                                        <img style={{'objectFit':'cover'}} src={q.Banner} alt="Question" height="100%" width="100%" />
                                        :
                                        <i class="fal fa-image fa-3x text-muted"></i>
                                    }
                                </div>
                                <div className="col-7 px-4 py-5">{q.Question}</div>
                            </div> 
                        </div>
                    })}
                    <button onClick={newQuestion} style={{'width':'auto', 'right':'0', 'bottom':'0', 'backgroundColor':'#0d1842'}} className="position-fixed btn m-5 rounded-pill box-shadow-card text-white px-5 py-2">Add a question</button>
                </div>
            </div>
        </div>
    )
}

export default EditQuiz
