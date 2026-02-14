import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

import "../App.css"

const TeacherLayout =() =>{
    const [collapsed,setcollapsed] =useState(false)
    const navigate = useNavigate()
    const location = useLocation()


    const menuItems = [
        {
            label:"Dashboard",path:"/teacher/dashboard",
        },
        {
            label:"student",path:"student",
        }
    ];



return (
    <div className="teacher-layout">
        <div className={`sidebar ${collapsed ? "collapsed":""}`}>
            <div className="sidebar-header">
                {!collapsed && <h3>Teacher</h3> }
                <button onClick={()=>setcollapsed(!collapsed)}>
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            <div className="menu">
                {menuItems.map((item,index) => (
                    <div key={index}
                    className={`menu-item ${location.pathname === item.path ? "active" : ""}`} onClick={()=> navigate(item.path)}
                    >
                        {!collapsed && item.label}
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

export default TeacherLayout