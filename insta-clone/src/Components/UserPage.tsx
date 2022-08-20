
import React, { lazy, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { displayPartsToString } from "typescript";
import { app_actions } from "../Redux/AppReducer";
import { Global_state_type } from "../Redux/Store";
import { UserType } from "../Redux/Types";
import { getUserPageByID } from "../Redux/UserPageReducer";


export const UserPage : React.FC = React.memo((props) => {
    const userPageUrl = useLocation().pathname.split("=")[1]
    const dispatch : any = useDispatch()
    useEffect(()=>{
       dispatch(getUserPageByID(userPageUrl))
    },[])
    let fullName = useSelector((state:Global_state_type) => {
        return state.userPage.fullName
    })
    let avatar = useSelector((state: Global_state_type) => {
        return state.userPage.avatar
    })
    let status = useSelector((state: Global_state_type) => {
        return state.userPage.status
    })
    
    return (
        <section>
            <h1>{fullName}</h1>
            <img src={avatar ? avatar : "#"} alt="" onLoad={()=> {
                dispatch(app_actions.set_is_fetch_true())
            }} style={{"width" : "200px","height" : "200px"}}/>
            <h1>{status}</h1>
        </section>
    )
})

