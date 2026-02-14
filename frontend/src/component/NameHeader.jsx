import { useAuth } from "../auth/AuthContext"
import "../App.css"


function NameHeader(){

    const {user} = useAuth()




    return (
        <div className="header">
            <h2>Welcome back <span> {user.name}</span></h2>
        </div>
    )

}

export default NameHeader;