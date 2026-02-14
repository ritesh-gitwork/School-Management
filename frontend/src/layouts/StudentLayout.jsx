import { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"
import { Outlet, useLocation, useNavigate } from "react-router-dom"


const StudentLayout = () => {

    const[collapsed,setcollapsed]=useState(false)
    const navigate = useNavigate()
    const location =useLocation()


    const menuItems = [
        {
            label:"Dashboard",
            path:"/student/dashboard",
        },
        {
            label:"Classes",
            path:"classes",
        },
        {
            label:"Attendence History",
            path:"attendence"
        }

    ]



  return (
    <div className="student-layout">
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
            {!collapsed && <h3>Student</h3>}

            <button
            className="toggle-btn"
            onClick={()=> setcollapsed(!collapsed)}
            >
                {!collapsed ? <FiMenu size={22}/>:<FiX size={22}/>}
            </button>
        </div>
        <div className="menu">
            {menuItems.map((item,index) =>(
                <div key={index}
                className={`menu-item ${
                    location.pathname === item.path ? "active":""
                }`}
                onClick={()=> navigate(item.path)}
                >
                    {!collapsed && item.label }
                </div>
            ))}
        </div>
      </div>

      <div className="content">
        <Outlet/>
      </div>
    </div>
  )
}

export default StudentLayout
