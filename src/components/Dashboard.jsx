import React, {useEffect, useState} from 'react'
import firebaseApp from '../firebase'
import {useAuth} from '../Contexts/AuthContext'
import ResultCard from './ResultCard'
import {useHistory} from 'react-router-dom'
import Loader from './Loader'
import NothingHere from './NothingHere'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ButtonLoader from './ButtonLoader'

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
      height:"90vh",
      position:'relative'
    },
}));


export default function Dashboard(props){
    const name=props.user.displayName && props.user.displayName.split(" ")[0];
    const {currentUser} = useAuth();
    const [quizzesAttended, setquizzesAttended] = useState([])
    const [quizzesOrganized, setquizzesOrganized] = useState([])
    const [loading, setloading] = useState(true)
    const [organizer, setorganizer] = useState(false)
    const [status, setstatus] = useState("")
    const [buttonloading, setbuttonloading] = useState(false)
    const [request, setrequest] = useState("")
    const [refetch, setrefetch] = useState(true)

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
    },[currentUser])

    useEffect(()=>{
        firebaseApp.firestore().collection("Requests").doc(currentUser.email).get().then((doc)=>{
            if(doc.data()){
                setrequest(doc.data().request)
            }
            if(doc.data() && doc.data().status === "accepted"){
                setorganizer(true)
            }
            if(doc.data() && doc.data().status !== undefined){
                setstatus(doc.data().status)
            }
        })
    },[currentUser, refetch])

    const newQuiz=()=>{
        firebaseApp.firestore().collection("Quizzes").add({
            quizName:"Untitled",
            organizer:currentUser.email
        }).then(ref=>{
            history.push('/edit/'+ref.id)
        })
    }
    //Modal
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const askPermissions=(e)=>{
        e.preventDefault()
        setbuttonloading(true)
        firebaseApp.firestore().collection("Requests").doc(currentUser.email).set({
            name:currentUser.displayName,
            email:currentUser.email,
            request:request,
            status:"",
            adminmessage:""
        },{merge:true}).then(()=>{
            setrefetch(!refetch)
            setbuttonloading(false)
            handleClose()
        })
    }

    return(loading?
        <Loader />
        :
        <div>
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
                            <p style={{'position':'absolute','width':'200px', 'top':'45px','left':'-45px', 'transform':'rotate(-45deg)', 'backgroundColor':status?status === "accepted"?'#43aa8b':'#f94144':'#f48c06'}} className="py-0 my-0 text-center px-2 fs-6 text-white">{status?status === "accepted"?"Accepted":"Rejected":"Under Review"}</p>:<div></div>
                            <form style={{'display':'flex', 'justifyContent':'space-between', 'flexDirection':'column', 'height':'100%'}} onSubmit={askPermissions}>
                                <div style={{'flex':'1'}} className='d-flex justify-content-between w-100'>
                                    <h5 id="transition-modal-title" className="text-center w-100">Tell us what you want</h5>
                                    <i style={{'cursor':'pointer'}} onClick={handleClose} class="fal fa-times-circle text-muted fs-3"></i>
                                </div>
                                <div style={{'flex':'7'}} className="h-75">
                                
                                </div>
                                <div style={{'flex':'1'}} class="input-group my-2 shadow rounded-2 d-flex h-25">
                                    <textarea value={request} onChange={e=>setrequest(e.target.value)} rows="1" required type="text" className="form-control border-0 py-2 px-4" placeholder="Explain your organization and your quiz in brief" />   
                                    <button type="submit" style={{'backgroundColor':'#0d1842', 'color':'#fff'}} className="btn shadow py-2 px-4">{buttonloading?<ButtonLoader />:<img src="send.png" alt="Send" height="20px" />}</button>
                                </div>
                            </form>
                        </div>
                    </Fade>
            </Modal>
            <h1 className="mb-5">Hello {name} !</h1>
            <div id="attended" className="p-3 rounded">
                <h5 className="pb-4 text-dark">Quizzes Attended</h5>
                <div className="row no-gutters">
                    {!quizzesAttended.length?
                        <NothingHere />
                        :
                        <div></div>
                    }
                    {quizzesAttended.map(quiz=>{
                        return <div className="col-lg-6">
                            <ResultCard id={quiz.quizID} title={quiz.quizDetails.quizName} score={quiz.score} maxScore={quiz.quizDetails.noOfQues} banner={quiz.quizDetails.banner} status="attended" />
                        </div>
                    })}
                </div>
            </div>
            {organizer?
                <div id="organized" className="p-3 rounded">
                    <div className="d-flex">
                        <h5 className="mb-4 py-0 text-dark me-4">Quizzes Organized</h5>
                        <button onClick={newQuiz} style={{'height':'30px', 'backgroundColor':'#0d1842'}} className="btn text-white py-0 px-3 rounded-pill shadow">Host a Quiz</button>
                    </div>
                    <div className="row no-gutters">
                    {!quizzesOrganized.length?
                        <NothingHere />
                        :
                        <div></div>
                    }
                    {quizzesOrganized.map(quiz=>{
                        return <div className="col-lg-6">
                            <ResultCard id={quiz[0]} title={quiz[1].quizName} banner={quiz[1].banner} status="organized" />
                        </div>
                    })}
                    </div>
                </div>
                :
                <div>
                    <p className="p-3" style={{'position':'absolute', 'bottom':'0'}}>Want to organize quizzes? Ask for permissions <button onClick={handleOpen} className="accent btn p-0 m-0">here</button>.</p>
                </div>
            }
        </div>
    )
}
