import React, {useContext, useEffect, useState} from 'react'
import firebaseApp from '../firebase';

const AuthContext=React.createContext()

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [currentUser, setcurrentUser] = useState()
    const [loading, setloading] = useState(true)

    useEffect(()=>{
        const unsubscribe=firebaseApp.auth().onAuthStateChanged(user=>{
            setcurrentUser(user);
            setloading(false)
        })
        return unsubscribe;
    },[])
    const value={
        currentUser
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

