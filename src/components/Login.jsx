import React from 'react'
import {useState} from 'react'
import firebaseApp, {googleProvider} from '../firebase'
import {Redirect, useHistory} from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'
import Toast from './Toast'

export default function Login(){
    const history=useHistory()
    const {currentUser}=useAuth()
    const [password,setPassword]=useState("");     //scholar no.
    const [email,setEmail]=useState("");         //email
    const [loading, setloading] = useState(false)
    const [toast, setToast]=useState()

    const handleLogin=(e)=>{
        setloading(true)
        firebaseApp.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                history.push('/dashboard')
                setloading(false)
            })
            .catch((error) => {
                var errorMessage = error.message;
                setToast(<Toast open={error} msg={errorMessage} />)
                setTimeout(() => {
                    setToast(null)
                }, 3000);
                setloading(false)
            });
    }
    const googleSignin=()=>{
        firebaseApp.auth()
            .signInWithPopup(googleProvider)
            .then((result) => {
                var user = result.user;
                firebaseApp.firestore().collection("Users").doc(user.email).get().then(doc=>{
                    if(!doc.exists){
                        firebaseApp.firestore().collection("Users").doc(user.email).set({
                            firstName: user.displayName.split(" ")[0],
                            lastName: user.displayName.split(" ")[1],
                            email:user.email,
                            photoURL:user.photoURL        
                        })
                    }
                }).then(()=>{
                    history.push("/dashboard")
                })
            }).catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }

    return (currentUser?
        <Redirect to="/" />
        :
        <div className="row g-0 min-vh-100">
        <div className="col-lg-4 col-md-5 p-5">
            <h3 className="text-dark text-center my-5">Welcome Back !</h3>
            <span>{toast}</span>
            <input className="rounded-top form-control py-3 bg-transparent text-input shadow" type="email" value ={email} onChange={event=>setEmail(event.target.value)}  placeholder="Email Address" required />
            <input className="form-control py-3 bg-transparent text-input shadow" value={password} onChange={event=>setPassword(event.target.value)} type="password" placeholder="Password" required />
            <button className="rounded-bottom btn w-100 my-btn text-white py-2 shadow" onClick={handleLogin}>
                {loading?
                    <div class="spinner-border text-light" role="status"></div>
                    :
                    "Sign In"
                }    
            </button>
            <div className="d-flex mt-5 mb-4">
                <div className="w-50 line"></div><p className="p-0 m-0 text-dark or px-1">or</p><div className="w-50 line"></div>
            </div>
            <button onClick={googleSignin} className="rounded btn w-100 py-2 bg-white mb-4 shadow"><img height="18px" alt="google" src="google.png" /><span className="mx-3">|</span>Sign in with Google</button>
            <p className="text-center text-dark">Don't have an account? <a href="/register" className="accent">Sign Up</a></p>
            <p className="text-center text-dark"></p>
        </div>
        <div className="col-lg-8 col-md-7 sideImg d-none d-lg-block d-md-block">
            <div class="shade">
            
            </div>
        </div>
    </div>)
}