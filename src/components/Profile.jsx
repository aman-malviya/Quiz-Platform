import React, {useEffect, useState} from 'react'
import {useAuth} from '../Contexts/AuthContext'
import firebaseApp from '../firebase'
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


function Profile() {
    const user=useAuth()
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [mobile, setmobile] = useState("")
    const [college, setcollege] = useState("")
    const [country, setcountry] = useState("")
    const [state, setstate] = useState("")
    const [city, setcity] = useState("")
    const [save, setsave] = useState(false)
    const [currentUser, setcurrentUser] = useState({})
    const [photo, setphoto] = useState("")
    useEffect(()=>{
        firebaseApp.firestore().collection("Users").doc(user.currentUser.email).get().then(doc=>{
            setname(doc.data().firstName+" "+doc.data().lastName)
            setemail(doc.data().email)
            setmobile(doc.data().mobileNumber)
            setcollege(doc.data().college)
            setstate(doc.data().state)
            setcity(doc.data().city)
            setcountry(doc.data().country)
            setphoto(doc.data().photoURL)
            let temp={
                name:doc.data().firstName+" "+doc.data().lastName,
                email:doc.data().email,
                completed:doc.data().completed,
                mobile:doc.data().mobileNumber,
                city:doc.data().city,
                state:doc.data().state,
                country:doc.data().country,
                college:doc.data().college,
            }
            setcurrentUser(temp);
        })
    },[save])


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
        let img=document.getElementById("image-input").files[0]
        firebaseApp.firestore().collection("Users").doc(user.currentUser.email).update({
            name:name,
            email:email,
            mobileNumber:mobile,
            college:college,
            city:city,
            state:state,
            country:country,
            completed:true
        }).then(()=>{
            if(img){
                updateImage(img)
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
                    setsave(!save)
                    handleClose()
                    window.location.reload()
                })
            })
        })
    }
    return (
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
                            <br />
                            <div className='d-flex justify-content-between w-100'>
                                <h5 id="transition-modal-title">Complete Your Profile</h5>
                                <i style={{'cursor':'pointer'}} onClick={handleClose} class="fal fa-times-circle text-muted fs-3"></i>
                            </div>
                            <br />  
                            <label><strong>Name</strong></label>
                            <div class="input-group my-2 shadow rounded-2">
                                <input disabled value={name} onChange={(e)=>setname(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Your Name" />   
                            </div>
                            <br />
                            <label><strong>Email</strong></label>
                            <div class="input-group my-2 shadow rounded-2">
                                <input disabled value={email} onChange={(e)=>setemail(e.target.value)} type="email" className="form-control border-0 py-2 px-4" placeholder="Enter Your Email" />   
                            </div>
                            <br />
                            <label><strong>Profile Picture</strong></label>
                            <div class="input-group my-2 shadow rounded-2">
                                <input id="image-input" type="file" className="form-control border-0 py-2 px-4" />   
                            </div>
                            <br />
                            <label><strong>Mobile Number</strong></label>
                            <div class="input-group my-2 shadow rounded-2">
                                <input value={mobile} onChange={(e)=>setmobile(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter Your Mobile Number" />   
                            </div>
                            <br />
                            <label><strong>College Name</strong></label>
                            <div class="input-group my-2 shadow rounded-2">
                                <input value={college} onChange={(e)=>setcollege(e.target.value)} type="text" className="form-control border-0 py-2 px-4" placeholder="Enter the Name of Current College" />   
                            </div>
                            <br />
                            <label><strong>Country where your college is located</strong></label>
                            <div class="input-group my-2 shadow rounded-2">
                                <select value={country} onChange={(e)=>setcountry(e.target.value)} class="form-select">
                                    <option selected value="">Select a Country</option>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                </select>   
                            </div>
                            <br />
                            <label><strong>State where your college is located</strong></label>
                            <div class="input-group my-2 shadow rounded-2">
                                <select value={state} onChange={(e)=>setstate(e.target.value)} class="form-select">
                                    <option selected value="">Select a State</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                </select>   
                            </div>
                            <br />
                            <label><strong>City where your college is located</strong></label>
                            <div class="input-group my-2 shadow rounded-2">
                                <select value={city} onChange={(e)=>setcity(e.target.value)} class="form-select">
                                    <option selected value="">Select a City</option>
                                    <option value="Bhopal">Bhopal</option>
                                    <option value="Sehore">Sehore</option>
                                </select>   
                            </div>
                            <br />
                            <button onClick={updateProfile} style={{'backgroundColor':'#0d1842', 'color':'#fff'}} className="btn shadow py-2 px-4">Save</button>
                            <br />
                        </div>
                    </Fade>
            </Modal>
            <div className="bg-white p-5 rounded-3 box-shadow-card position-relative">
                <i onClick={handleOpen} class="fal fa-pen fs-5 edit-icon p-5"></i>
                <div style={{'height':'120px', 'width':'120px'}}>
                    <img alt="Profile" style={{'objectFit':'cover'}} className="rounded-circle mb-4 box-shadow-card w-100 h-100" src={photo} />         
                </div>
                <h2 className="profile-name">{currentUser.name}</h2>
                <br />
                <br />
                <div className="row">
                    <div className="col-lg-6">
                        <p><strong>Contact Information</strong></p>
                        <h6>{currentUser.email}</h6>
                        {currentUser.mobile??<h6>{currentUser.mobile}</h6>}
                        <br />
                        <br />
                    </div>
                    {currentUser.completed?
                        <div className="col-lg-6">
                            <p><strong>Education</strong></p>
                            <h6>{currentUser.college}</h6>
                            <h6>{currentUser.city}</h6>
                            <h6>{currentUser.state}</h6>
                            <h6>{currentUser.country}</h6>
                        </div>
                        :
                        <div>
                            <button onClick={handleOpen} style={{'border':'2px solid #0d1842', 'color':'#0d1842'}} className="bg-white px-4 py-2 rounded-pill w-100">Complete your profile</button>
                            <p className="text-muted text-center mt-2">Complete your profile to find out amazing things</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile
