import React, { useEffect, useState } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { chatAPI } from "../../DAL/ChatAPI";
import { app_actions } from "../../Redux/AppReducer";
import { chat_actions } from "../../Redux/ChatReducer";
import { updateAvatarThunk } from "../../Redux/ProfileReducer";
import { Global_state_type } from "../../Redux/Store";
import { ChatType } from "../../Redux/Types";
import { getUserPageByID, userPageActions } from "../../Redux/UserPageReducer";
import { UserPostsList } from "../Posts/UsersPostsList";
import { UserStatus } from "../UserStatus/Status";




export const UserPage : React.FC = React.memo(() => {
    const navigate = useNavigate()
    const account = useSelector((state : Global_state_type) => {
        return state.account
    })
    //Local state If isNewMessage true render message window
    let [isNewMessage,setIsNewMessage] = useState(false)

    //Get userPageID from query string
    const userPageUrl = useLocation().pathname.split("=")[1]
    //Count of user posts 
    const publicatiponsCount = useSelector((state:Global_state_type) => {
        return state.userPosts.posts.length
    })
    //Fetch the actual user page by ID from query string
    const dispatch : any = useDispatch()
    useEffect(()=>{
       dispatch(getUserPageByID(userPageUrl))
    },[userPageUrl])
    
    const currentUserID = useSelector((state:Global_state_type) => {
        return state.app.currentUserID
    })

    const actualUserPage = useSelector((state:Global_state_type) => {
        return state.userPage
    }) 
    //Status update handler aloowed only on current user page
    const setNewStatus = (userID : string,status : string) => {
        dispatch(userPageActions.setStatus(status))
    }
    //Avatar update handler convert file blob input into string
    const updateAvatar = (event : any) => {
        let target = event.target
        let fileReader = new FileReader()
        if(!target.files.length){
            console.log("ERROR")
        }else{
            fileReader.readAsDataURL(target.files[0])
            fileReader.onload = function () {
                dispatch(updateAvatarThunk(fileReader.result,currentUserID))
            }
            
        }
    }

    //Follow button handler render only when user page is not actualUser
    const followToogle = () => {
        if(actualUserPage.followers?.includes(currentUserID)){
            dispatch(userPageActions.unfollow(currentUserID))
        }else{
            dispatch(userPageActions.follow(currentUserID))
        }
    }
    //Send message Handler
    const sendMessage = () => {
        dispatch(chat_actions.setActiveChat(actualUserPage.userID as string))
        navigate("/chat")
    }
    return (
        <section>
            <h1>{actualUserPage.fullName}</h1>
            <label htmlFor="avatarInput">
            <img src={actualUserPage.avatar ? actualUserPage.avatar : "#"} alt="" onLoad={()=> {
                dispatch(app_actions.set_is_fetch_true())
            }} style={{"width" : "200px","height" : "200px"}}/>
            </label>
            <br />
            <span>{publicatiponsCount + "\t publications"}</span>
            <br />
            <input type="file" placeholder="Files" onChange={updateAvatar} id="avatarInput" style={{"display" : "none"}}></input>
            <span>{actualUserPage.followers?.length + "\t  followers"}</span>
            <br />
            <span>{actualUserPage.subscribes?.length + "\t subscribes"}</span>
            {userPageUrl !== currentUserID ? <button onClick={followToogle}>{Object.values(actualUserPage.followers as Array<string>).includes(currentUserID)? "Unfollow": "Follow" }</button> : null}
            {userPageUrl === currentUserID ? <UserStatus status={actualUserPage.status} userID={userPageUrl} setNewStatus={setNewStatus}/> : <span>{actualUserPage.status}</span>}
            {userPageUrl !== currentUserID ? <button onClick={sendMessage}>Send message</button> : null}
            <hr />
            <button onClick={() => {
                //@ts-ignore
                const result = chatAPI.isChatExist(account.chats[0].chatRef as Array<ChatType>).then((res) => {
                    console.log(res)
                })
               
            }}>Get</button>
            <UserPostsList/>
        </section>
    )
})

