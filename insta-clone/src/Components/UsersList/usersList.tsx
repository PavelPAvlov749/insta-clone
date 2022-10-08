import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Global_state_type } from "../../Redux/Store";
import { getFolloewrsThunk, getFollowedthunk } from "../../Redux/UserSearchReducer";

import styles from "../../Styles/usersList.module.css";


export const UsersList : React.FC = React.memo((props) => {
    const dispatch : any = useDispatch()
    const location = useLocation()
    let path : string = location.pathname.split("/")[3]
    let userID : string = location.pathname.split("/")[2].split("=")[1]

    useEffect(() => {
        if(path === "followers"){
            dispatch(getFolloewrsThunk(userID))
        }else{
            dispatch(getFollowedthunk(userID))
        }
    },[])
    const users = useSelector((state:Global_state_type) => {
        return state.search.users
    })
    const onClickHandler = () => {

    }
    const onBlurHandler = () => {

    }
    console.log(users)
    return (
        <section className={styles.UsersList}>
            <input placeholder="Search users" onClick={onClickHandler} onBlur={onBlurHandler}></input>
        </section>
    )
})  