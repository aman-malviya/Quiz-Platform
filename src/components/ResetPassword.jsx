import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

function ResetPassword() {
    const [buttonLoading, setbuttonLoading] = useState(false)
    const [toast, setToast]=useState()
    const [pwd1,setpwd1]=useState("");
    const [pwd2,setpwd2]=useState("");
    const history=useHistory()

    const resetPassword=(e)=>{
        e.preventDefault();
        history.push("/reset-password")
    }

    return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
        <form onSubmit={resetPassword} className="reset-password">
            <div className="d-flex justify-content-center">
                <img src="edify.png" height="90px" width="90px" alt="Edify" className="awesome-shadow-13 rounded-circle" />        
            </div>
            <h3 className="text-dark my-5 text-center">Reset Password</h3>
            <span>{toast}</span>
            <input className="text-center rounded-top form-control py-3 bg-transparent text-input shadow" type="password" value ={pwd1} onChange={event=>setpwd1(event.target.value)}  placeholder="New Password" required />
            <input className="text-center rounded-top form-control py-3 bg-transparent text-input shadow" type="password" value ={pwd2} onChange={event=>setpwd2(event.target.value)}  placeholder="Confirm New Password" required />
            <button type="submit" className="rounded-bottom btn w-100 my-btn text-white py-2 shadow">
                {buttonLoading?
                    <div class="spinner-border text-light" role="status"></div>
                    :
                    "Change Password"
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

export default ResetPassword
