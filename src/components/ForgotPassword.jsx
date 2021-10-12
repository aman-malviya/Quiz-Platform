import React, {useState} from 'react'
import firebaseApp from '../firebase'
import {useAuth} from '../Contexts/AuthContext'

function ForgotPassword() {
    const [buttonLoading, setbuttonLoading] = useState(false)
    const [toast, setToast]=useState()
    const [email,setEmail]=useState("");         //email
    const {user}=useAuth()

    const forgotPassword=(e)=>{
        e.preventDefault();
        firebaseApp.auth().sendPasswordResetEmail(email, {url:'http://localhost:3000/login'}).then((res)=>{
            console.log(res);
        }).catch(err=>{
            console.log(err.message);
        })
    }
    return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
        <form onSubmit={forgotPassword} className="reset-password">
            <div className="d-flex justify-content-center">
                <img src="edify.png" height="90px" width="90px" alt="Edify" className="awesome-shadow-13 rounded-circle" />        
            </div>
            <h3 className="text-dark my-5 text-center">Forgot Password</h3>
            <span>{toast}</span>
            <input className="text-center rounded-top form-control py-3 bg-transparent text-input shadow" type="email" value ={email} onChange={event=>setEmail(event.target.value)}  placeholder="Email Address" required />
            <button type="submit" className="rounded-bottom btn w-100 my-btn text-white py-2 shadow">
                {buttonLoading?
                    <div class="spinner-border text-light" role="status"></div>
                    :
                    "Submit"
                }    
            </button>
            <br />
            <br />
            <br />
            <br />
        </form>
    </div>
    )
}

export default ForgotPassword
