import React, { useEffect, useState } from 'react'
import firebaseApp from '../firebase'
import {Link} from 'react-router-dom'
import TopThree from './TopThree'
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
      borderRadius:'15px',
      width:'300px'
    },
  }));

export default function ResultCard(props){
    const [participants, setparticipants] = useState([])
    const [buttonloading, setbuttonloading] = useState(false)
    const [first, setfirst] = useState("")
    const [second, setsecond] = useState("")
    const [third, setthird] = useState("")
    const [firstURL, setfirstURL] = useState("")
    const [secondURL, setsecondURL] = useState("")
    const [thirdURL, setthirdURL] = useState("")
    const [results, setresults] = useState(false)

    useEffect(()=>{
        firebaseApp.firestore().collection("Quizzes").doc(props.id).get().then(doc=>{
            if(doc.data() && doc.data().resultsReleased){
                setresults(doc.data().resultsReleased)
                let f=doc.data().winners.first;
                let s=doc.data().winners.second;
                let t=doc.data().winners.third
                setfirst(f)
                setsecond(s)
                setthird(t)
                firebaseApp.firestore().collection("Users").doc(f).get().then(d=>{
                    setfirstURL(d.data().photoURL)
                })
                firebaseApp.firestore().collection("Users").doc(s).get().then(d=>{
                    setsecondURL(d.data().photoURL)
                })
                firebaseApp.firestore().collection("Users").doc(t).get().then(d=>{
                    setthirdURL(d.data().photoURL)
                })
            }
        })
    },[props])
    
    const download=(e)=>{
        e.preventDefault();
        setbuttonloading(true)
        let id=props.id;
        firebaseApp.firestore().collection("Quizzes/"+id+"/Attendees").get().then((docs)=>{
            let temp=[];
            docs.forEach(doc=>{
                temp.push(doc.data())
            })
            return temp;
        }).then((res)=>{
            res = res.map(doc=>{
                return ({
                    Name:doc.attendeeDetails.Name,
                    Email:doc.attendeeDetails.Email,
                    MobileNumber:doc.attendeeDetails.MobileNumber,
                    College:doc.attendeeDetails.College,
                    City:doc.attendeeDetails.City,
                    State:doc.attendeeDetails.State,
                    Score:doc.attendeeScore
                })
            })
            
            let csvRows=[];
            const headers = Object.keys(res[0]).join(",");
            csvRows.push(headers);

            res.forEach(row=>{
                const values = Object.keys(res[0]).map(key=>{
                    const escaped = (''+row[key]).replace(/"/g, '\\"')
                    return `"${escaped}"`;
                })
                csvRows.push(values.join(","));
            })
            csvRows=csvRows.join("\n")

            const  blob = new Blob([csvRows], {type:'text/csv'});
            const url =window.URL.createObjectURL(blob);
            const a=document.createElement('a');
            a.setAttribute('hidden','');
            a.setAttribute('href', url);
            a.setAttribute('download','Results.csv');
            document.body.appendChild(a);
            a.click()
            document.body.removeChild(a);
            setbuttonloading(false);
        }).catch(e=>{
            console.log(e)
        })
    }

    //Modal
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        firebaseApp.firestore().collection("Quizzes/"+props.id+"/Attendees").orderBy('attendeeScore','desc').get().then((docs)=>{
            let temp=[];
            docs.forEach(doc=>{
                temp.push(doc.data())
            })
            setparticipants(temp);
        }).then(()=>{
            setOpen(true);
        })
    };

    const handleClose = () => {
        setOpen(false);
    };
    const deleteQuiz=(e)=>{
        e.preventDefault()
        firebaseApp.firestore().collection("Quizzes").doc(props.id).delete().then(()=>{
            handleClose()
            window.location.reload()
        })
    }
    const releaseResults=(e)=>{
        e.preventDefault()
        setbuttonloading(true)
        firebaseApp.firestore().collection("Quizzes").doc(props.id).update({
            winners:{
                first:first,
                second:second,
                third:third
            },
            resultsReleased:true
        }).then(()=>{
            setbuttonloading(false)
            handleClose()
            window.location.reload()
        })
    }

    return(<div className="mb-3">
            <div>
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
                            <form onSubmit={releaseResults}>
                                <br />
                                {results?<p className="text-danger">Note: You have already released the results, this action may alter the previous results.</p>:<p></p>}
                                <h5 id="transition-modal-title">Release Results</h5>
                                <br />
                                <div class="input-group my-2 shadow rounded-pill">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroupPrepend2">1</span>
                                    </div>
                                    <select value={first} onChange={e=>setfirst(e.target.value)} required class="form-select">
                                        <option value="" selected>First</option>
                                        {participants.map(p=>{
                                            return <option value={p.attendeeDetails.Email}>{p.attendeeDetails.Email}</option>
                                        })}
                                    </select>    
                                </div>
                                <div class="input-group my-2 shadow rounded-pill">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroupPrepend2">2</span>
                                    </div>
                                    <select value={second} onChange={e=>setsecond(e.target.value)} required class="form-select">
                                        <option value="" selected>Second</option>
                                        {participants.map(p=>{
                                            return <option value={p.attendeeDetails.Email}>{p.attendeeDetails.Email}</option>
                                        })}
                                    </select>        
                                </div>
                                <div class="input-group my-2 shadow rounded-pill">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroupPrepend2">3</span>
                                    </div>
                                    <select value={third} onChange={e=>setthird(e.target.value)} required class="form-select">
                                        <option value="" selected>Third</option>
                                        {participants.map(p=>{
                                            return <option value={p.attendeeDetails.Email}>{p.attendeeDetails.Email}</option>
                                        })}
                                    </select>        
                                </div>
                                <br />
                                <button type="submit" style={{'backgroundColor':'#0d1842', 'color':'#FFF'}} className="btn rounded-pill w-100 shadow">{buttonloading?<ButtonLoader />:"Release"}</button>
                                <br />
                                <br />
                            </form>
                            <button className="btn w-100 p-0 m-0 fs-4" onClick={handleClose}><i class="fal fa-times-circle"></i></button>
                        </div>
                    </Fade>
                </Modal>
            </div>
            <div style={{'background':'url("'+props.banner+'")', 'borderRadius':'10px'}} className="sideImg box-shadow-card">
                <div style={{'borderRadius':'10px'}} className="blue py-2 w-100">
                    <br /><br /><br /><br />
                    <br /><br /><br /><br />
                    <div className="d-flex justify-content-center">
                        {props.status === "attended"?
                            <div>
                                {results?
                                    <TopThree firstURL={firstURL} secondURL={secondURL} thirdURL={thirdURL} first={first} second={second} third={third} />
                                    :
                                    <p style={{'cursor':'default', 'opacity':'0.5'}} className="d-inline quiz-btn text-white px-5 py-2 btn">Results Awaited</p>
                                }
                            </div>
                            :
                            <button onClick={handleOpen} className="d-inline quiz-btn text-white buttonx-5 px-5 py-2 btn">Release Results</button>
                        }
                    </div>
                    <br /><br /><br /><br />
                    <div style={{'justifyContent':'space-between', 'alignItems':'center', 'padding':'10px 20px'}} className="d-flex text-white">
                        <h5>{props.title}</h5>
                        {props.score?
                            <div style={{'display':'grid', 'gridTemplateColumns':'110px 50px', 'justifyContent':'center', 'alignItems':'center'}}>
                                <div>
                                    <h5 className='d-inline m-0 p-0'>Your Score</h5>
                                    <p className="p-0 m-0" style={{'color':'#fff', 'opacity':'0.7'}}>out of {props.maxScore}</p>
                                </div>
                                <div>
                                    <div className="d-inline fs-5" style={{'padding':'10px 12px','border':'2px solid #fff', 'borderRadius':'50%', 'marginLeft':'10px'}}>{props.score}</div>
                                </div>
                            </div>
                            :
                            <div>
                                <button onClick={deleteQuiz} data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Quiz" className="btn rounded-circle p-2 text-white"><i class="fal fa-trash fs-4"></i></button>
                                <Link to={"/edit/"+props.id}><button data-bs-toggle="tooltip" data-bs-placement="top" title="Edit quiz" className="btn rounded-circle p-2 text-white"><i class="fal fa-pen fs-4"></i></button></Link>
                                <button onClick={download} data-bs-toggle="tooltip" data-bs-placement="top" title="Download Results" className="btn rounded-circle p-2 text-white">{buttonloading?<ButtonLoader />:<i class="far fa-arrow-to-bottom fs-4"></i>}</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}