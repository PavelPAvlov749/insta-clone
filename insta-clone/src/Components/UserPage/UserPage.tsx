
import React, { lazy, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { displayPartsToString } from "typescript";
import { app_actions } from "../../Redux/AppReducer";
import { Global_state_type } from "../../Redux/Store";
import { UserType } from "../../Redux/Types";
import { getUserPageByID, userPageActions } from "../../Redux/UserPageReducer";
import { usersActions } from "../../Redux/UsersSerarchReducer";
import { UserPostsList } from "../Posts/UsersPostsList";
import { UserStatus } from "../UserStatus/Status";


export const UserPage : React.FC = React.memo((props) => {
    const userPageUrl = useLocation().pathname.split("=")[1]
    const dispatch : any = useDispatch()
    useEffect(()=>{
       dispatch(getUserPageByID(userPageUrl))
    },[userPageUrl])
    
    const currentUserID = useSelector((state:Global_state_type) => {
        return state.app.currentUserID
    })
    const followers = useSelector((state:Global_state_type) => {
        return state.userPage.followers
    })

    let fullName = useSelector((state:Global_state_type) => {
        return state.userPage.fullName
    })
    let avatar = useSelector((state: Global_state_type) => {
        return state.userPage.avatar
    })
    let status = useSelector((state: Global_state_type) => {
        return state.userPage.status
    })
    const setNewStatus = (userID : string,status : string) => {
        dispatch(userPageActions.setStatus(status))
    }
    let imgURl = null
    const updateAvatar = (event : any) => {
        let target = event.target
        let fileReader = new FileReader()
        let img = document.getElementById("newPost")
        
        if(!target.files.length){
            console.log("ERROR")
        }else{
            fileReader.readAsDataURL(target.files[0])
            fileReader.onload = function () {
                imgURL = fileReader.result
                dispatch(postActions.setNewPostPhoto(imgURL))
                console.log(imgURL)
            }
            
        }
    }
    return (
        <section>
            <h1>{fullName}</h1>
            <label>
            <img src={avatar ? avatar : "#"} alt="" onLoad={()=> {
                dispatch(app_actions.set_is_fetch_true())
            }} style={{"width" : "200px","height" : "200px"}}/>
            </label>
            <img src={avatar ? avatar : "#"} alt="" onLoad={()=> {
                dispatch(app_actions.set_is_fetch_true())
            }} style={{"width" : "200px","height" : "200px"}}/>
            {userPageUrl !== currentUserID ? <button>{Object.values(followers as Array<string>).includes(currentUserID)? "Unfollow": "Follow" }</button> : null}
            <UserStatus status={status} userID={userPageUrl} setNewStatus={setNewStatus}/>
            <hr />
            <UserPostsList/>
        </section>
    )
})

