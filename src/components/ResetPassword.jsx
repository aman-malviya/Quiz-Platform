import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import firebaseApp from '../firebase'
import {useLocation} from 'react-router-dom'
import ButtonLoader from './ButtonLoader'
import Toast from './Toast'

function ResetPassword() {
    const [buttonLoading, setbuttonLoading] = useState(false)
    const [toast, setToast]=useState()
    const [pwd1,setpwd1]=useState("");
    const [pwd2,setpwd2]=useState("");
    const history=useHistory()
    const location=useLocation()
    const params=new URLSearchParams(location.search)
    const mode=params.get('mode');
    const [countdown, setcountdown] = useState(5)
    
    useEffect(()=>{
        if(countdown === 0){
            history.push("/");
        }
        if(mode === 'signIn'){
            setInterval(() => {
                setcountdown(countdown-1);
            }, 1000);
        }
    },[countdown, history, mode])

    const resetPassword=(e)=>{
        e.preventDefault();
        setbuttonLoading(true)
        if(pwd1 !== pwd2){
            setToast(<Toast msg="Passwords do not match" />)
            setbuttonLoading(false)
            setTimeout(() => {
                setToast(null)
            }, 3000);
            return;
        }
        if(pwd1.length < 8){
            setToast(<Toast msg="Password too small" />)
            setbuttonLoading(false)
            setTimeout(() => {
                setToast(null)
            }, 3000);
            return;
        }
        const oobcode = params.get('oobCode');
        firebaseApp.auth().confirmPasswordReset(oobcode, pwd1).then(res=>{
            setbuttonLoading(false)
            setToast(<Toast msg="Password successfully reset." success="true" />)
            setTimeout(() => {
                setToast(null)
                history.push("/login")
            }, 3000);
        }).catch(err=>{
            setbuttonLoading(false)
            setToast(<Toast msg={err.message} />)
            setTimeout(() => {
                setToast(null)
            }, 3000);
        })
    }

    return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
        <form onSubmit={resetPassword} className="reset-password">
            <div className="d-flex justify-content-center">
                <img src="edify.png" height="90px" width="90px" alt="Edify" className="awesome-shadow-13 rounded-circle" />        
            </div>
            {
                mode==="signIn"?
                <div>
                    <div className="w-100 shadow-lg p-3 my-5 rounded-3 d-flex align-items-center justify-content-center"><i style={{'color':'#4bb543', 'fontSize':'1.8rem'}} class="far fa-check-circle me-3"></i> Email Verified</div>
                    <div style={{'display':'flex', 'flexDirection':'column', 'alignItems':'center'}}>
                        <h4 className="text-center">Redirecting to dashboard in</h4>
                        <br />
                        <div style={{'width':'100px', 'height':'100px', 'border':'10px solid #8639f9'}} className="rounded-circle shadow d-flex justify-content-center align-items-center">
                            <span className="fs-1">{countdown}</span>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <h3 className="text-dark my-5 text-center">Reset Password</h3>
                    <span>{toast}</span>
                    <input className="text-center rounded-top form-control py-3 bg-transparent text-input shadow" type="password" value ={pwd1} onChange={event=>setpwd1(event.target.value)}  placeholder="New Password" required />
                    <input className="text-center rounded-top form-control py-3 bg-transparent text-input shadow" type="password" value ={pwd2} onChange={event=>setpwd2(event.target.value)}  placeholder="Confirm New Password" required />
                    <button type="submit" className="rounded-bottom btn w-100 my-btn text-white py-2 shadow">
                        {buttonLoading?
                            <ButtonLoader />
                            :
                            "Change Password"
                        }    
                    </button>
                </div>
            }
            <br />
            <br />
            <br />
            <br />
        </form>
    </div>
    )
}

export default ResetPassword
