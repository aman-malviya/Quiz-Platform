import React, {useEffect, useState} from 'react'
import {useAuth} from '../Contexts/AuthContext'
import firebaseApp from '../firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Loader from './Loader';
import ButtonLoader from './ButtonLoader';
import {cities, states} from '../cities'


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


function Profile() {
    const user=useAuth()
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [mobile, setmobile] = useState("")
    const [college, setcollege] = useState("")
    const [state, setstate] = useState("")
    const [city, setcity] = useState("")
    const [refetch, setrefetch] = useState(false)
    const [currentUser, setcurrentUser] = useState({})
    const [photo, setphoto] = useState("")
    const [loading, setloading] = useState(true)
    const [buttonloading, setbuttonloading] = useState(false)
    const [profilecomplete, setprofilecomplete] = useState(false)
    useEffect(()=>{
        firebaseApp.firestore().collection("Users").doc(user.currentUser.email).get().then(doc=>{
            setname(doc.data().firstName+" "+doc.data().lastName)
            setemail(doc.data().email)
            setmobile(doc.data().mobileNumber)
            setcollege(doc.data().college)
            setstate(doc.data().state)
            setcity(doc.data().city)
            setphoto(doc.data().photoURL)
            setprofilecomplete(doc.data().completed)
            let temp={
                name:doc.data().firstName+" "+doc.data().lastName,
                email:doc.data().email,
                completed:doc.data().completed,
                mobile:doc.data().mobileNumber,
                city:doc.data().city,
                state:doc.data().state,
                college:doc.data().college,
            }
            setcurrentUser(temp);
            setloading(false)
        })
    },[refetch, user])


    //Modal
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateProfile=(e)=>{
        e.preventDefault()
        setbuttonloading(true)
        let img=document.getElementById("image-input").files[0]
        firebaseApp.firestore().collection("Users").doc(user.currentUser.email).update({
            name:name,
            email:email,
            mobileNumber:mobile,
            college:college,
            city:city,
            state:state,
            completed:true
        }).then(()=>{
            if(img){
                updateImage(img)
            }else{
                setbuttonloading(false)
                if(!profilecomplete){
                    window.location.reload()
                }
                setrefetch(!refetch)
                handleClose()
            }
        })
    }
    const updateImage=(img)=>{
        var metadata={
            contentType:img.type,
        }
        firebaseApp.storage().ref().child("profiles/"+email).put(img, metadata)        
        .then((snap)=>{
            firebaseApp.storage().ref().child("profiles/"+email).getDownloadURL().then(url=>{
                firebaseApp.firestore().collection('Users').doc(email).update({
                    photoURL:url
                }).then(()=>{
                    setbuttonloading(false)
                    setrefetch(!refetch)
                    handleClose()
                    window.location.reload()
                })
            })
        })
    }
    return (loading?
        <Loader />
        :
        <div>
            <h1 className="mb-5">{currentUser.completed?"Profile":"Complete Your Profile"}</h1>
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
                            <form onSubmit={updateProfile}>
                                <br />
                                <div className='d-flex justify-content-between w-100'>
                                    <h5 id="transition-modal-title">Complete Your Profile</h5>
                                    <i style={{'cursor':'pointer'}} onClick={handleClose} class="fal fa-times-circle text-muted fs-3"></i>
                                </div>
                                <br />  
                                <label><strong>Name <span className="text-danger">*</span></strong></label>
                                <div class="input-group my-2 shadow rounded-2">
                                    <input required disabled value={name} onChange={(e)=>setname(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Your Name" />   
                                </div>
                                <br />
                                <label><strong>Email <span className="text-danger">*</span></strong></label>
                                <div class="input-group my-2 shadow rounded-2">
                                    <input required disabled value={email} onChange={(e)=>setemail(e.target.value)} type="email" className="form-control border-0 py-2 px-4" placeholder="Enter Your Email" />   
                                </div>
                                <br />
                                <label><strong>Profile Picture</strong></label>
                                <div class="input-group my-2 shadow rounded-2">
                                    <input id="image-input" type="file" className="form-control border-0 py-2 px-4" />   
                                </div>
                                <p className="text-muted">Note: This image will replace your previous profile picture (if any).</p>
                                <br />
                                <label><strong>Mobile Number <span className="text-danger">*</span></strong></label>
                                <div class="input-group my-2 shadow rounded-2">
                                    <input required value={mobile} onChange={(e)=>setmobile(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Your Mobile Number" />   
                                </div>
                                <br />
                                <label><strong>College Name <span className="text-danger">*</span></strong></label>
                                <div class="input-group my-2 shadow rounded-2">
                                    <input required value={college} onChange={(e)=>setcollege(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter the Name of Current College" />   
                                </div>
                                <br />
                                <label><strong>State where your college is located <span className="text-danger">*</span></strong></label>
                                <div class="input-group my-2 shadow rounded-2">
                                    <select required value={state} onChange={(e)=>setstate(e.target.value)} class="form-select">
                                        <option selected value="">Select a State</option>
                                        {states.map(s=>{
                                            return <option value={s}>{s}</option>
                                        })}
                                    </select>   
                                </div>
                                <br />
                                <label><strong>City where your college is located <span className="text-danger">*</span></strong></label>
                                <div class="input-group my-2 shadow rounded-2">
                                    <select required value={city} onChange={(e)=>setcity(e.target.value)} class="form-select">
                                        <option selected value="">Select a City</option>
                                        {cities.map(c=>{
                                            return c.state === state ? <option value={c.name}>{c.name}</option> : null;
                                        })}
                                    </select>   
                                </div>
                                <br />
                                <button type="submit" style={{'backgroundColor':'#0d1842', 'color':'#fff'}} className="btn shadow py-2 px-4">{buttonloading?<ButtonLoader />:"Save"}</button>
                                <br />
                            </form>
                        </div>
                    </Fade>
            </Modal>
            <div className="bg-white p-5 rounded-3 box-shadow-card position-relative">
                <i onClick={handleOpen} class="fal fa-pen fs-5 edit-icon p-5"></i>
                <div style={{'height':'120px', 'width':'120px'}}>
                    <img alt="Profile" style={{'objectFit':'cover'}} className="rounded-circle mb-4 box-shadow-card w-100 h-100" src={photo?photo:"man.png"} />         
                </div>
                <h2 className="profile-name">{currentUser.name}</h2>
                <br />
                <br />
                <div className="row">
                    <div className="col-lg-6">
                        <p><strong>Contact Information</strong></p>
                        <h6>{currentUser.email}</h6>
                        {currentUser.mobile?<h6>{currentUser.mobile}</h6>:<div></div>}
                        <br />
                        <br />
                    </div>
                    {currentUser.completed?
                        <div className="col-lg-6">
                            <p><strong>Education</strong></p>
                            <h6>{currentUser.college}</h6>
                            <h6>{currentUser.city}</h6>
                            <h6>{currentUser.state}</h6>
                        </div>
                        :
                        <div>
                            <button onClick={handleOpen} style={{'border':'2px solid #0d1842', 'color':'#0d1842'}} className="bg-white px-4 py-2 rounded-pill w-100">Complete your profile</button>
                            <p className="text-muted text-center mt-2">Complete your profile to discover some awesome stuff</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile
