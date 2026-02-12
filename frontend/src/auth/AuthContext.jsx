import { createContext, useContext, useState } from "react";

const AuthContext = createContext()


export const AuthProvider = ({children})=>{
    const storedUser = localStorage.getItem("user")
    const[user,setuser] = useState(
        storedUser ? JSON.parse(storedUser) : null
    )

    const login = (token,userData)=>{
        localStorage.setItem("token",token)
        localStorage.setItem("user",JSON.stringify(userData))
        setuser(userData)
        console.log("user ka log",user);
        
    }

    const logout = () =>{
        localStorage.clear()
        setuser(null)
    }

    return(
        <AuthContext.Provider value ={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth =()=> useContext(AuthContext)