import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { chatAPI } from "../../DAL/ChatAPI";
import { app_actions } from "../../Redux/AppReducer";
import { chat_actions } from "../../Redux/ChatReducer";
import { AccountActions, updateAvatarThunk } from "../../Redux/ProfileReducer";
import { Global_state_type } from "../../Redux/Store";
import { ChatType } from "../../Redux/Types";
import { followTooglethunk, getUserPageByID, userPageActions } from "../../Redux/UserPageReducer";
import { UserPostsList } from "../Posts/UsersPostsList";
import { UserStatus } from "../UserStatus/Status";
import styles from "../../Styles/UserPage.module.css"
import { userPageSelector } from "../../Selectors/Selectors";




export const UserPage: React.FC = React.memo(() => {
    
    const navigate = useNavigate()
    const account = useSelector((state: Global_state_type) => {
        return state.account
    })
    //Local state If isNewMessage true render message window
    let [isNewMessage, setIsNewMessage] = useState(false)

    //Get userPageID from query string
    const userPageUrl = useLocation().pathname.split("=")[1]
    //Count of user posts 
    const publicatiponsCount = useSelector((state: Global_state_type) => {
        return state.userPosts.posts.length
    })
    //Fetch the actual user page by ID from query string
    const dispatch: any = useDispatch()
    useEffect(() => {
        dispatch(getUserPageByID(userPageUrl))
    }, [userPageUrl])

    const currentUserID = useSelector((state: Global_state_type) => {
        return state.app.currentUserID
    })

    const actualUserPage = useSelector((state: Global_state_type) => {
        return state.userPage
    })
    //Status update handler aloowed only on current user page
    const setNewStatus = (userID: string, status: string) => {
        dispatch(userPageActions.setStatus(status))
    }
    //Avatar update handler convert file blob input into string
    const updateAvatar = (event: any) => {

        let fileReader = new FileReader()
        if (!event.target.files.length) {
            console.log("ERROR")
        } else {
            fileReader.readAsDataURL(event.target.files[0])
            fileReader.onload = function () {
                dispatch(updateAvatarThunk(event.target.files[0], currentUserID))
                dispatch(AccountActions.updateAvatar(fileReader.result?.toString()))
            }

        }
    }

    //Follow button handler render only when user page is not actualUser
    const followToogle = () => {

        if (actualUserPage.followers?.includes(currentUserID)) {
            dispatch(followTooglethunk(currentUserID, actualUserPage.userID))
            dispatch(userPageActions.unfollow(currentUserID))
        } else {
            dispatch(followTooglethunk(currentUserID, actualUserPage.userID))
            dispatch(userPageActions.follow(currentUserID))
        }
    }
    //Send message Handler
    const sendMessage = () => {

        navigate(`/chat/id:=${actualUserPage.userID}`)
    }
    return (
        <div >
                <section  className={styles.userPageWrapper} >
                    <label htmlFor="avatarInput">
                        <img className={styles.avatar} src={actualUserPage.avatar ? actualUserPage.avatar : "#"} alt="" onLoad={() => {
                            dispatch(app_actions.set_is_fetch_true())
                        }} />
                    </label>
                    <br />
                    <div className={styles.info}>
                        <h1 className={styles.fullName}>{actualUserPage.fullName}</h1>
                        {userPageUrl === currentUserID ? <UserStatus status={actualUserPage.status} userID={userPageUrl} setNewStatus={setNewStatus} /> : <span>{actualUserPage.status}</span>}
                        <br />
                        <span className={styles.publications}>{publicatiponsCount + "\t publications"}</span>
                        <br />
                        <input type="file" placeholder="Files" accept="image/*" onChange={updateAvatar} id="avatarInput" style={{ "display": "none" }}></input>
                        <span>{actualUserPage.followers?.length + "\t  followers"}</span>
                        <br />

                        <span className={styles.subscribesCount}>{actualUserPage.subscribes?.length + "\t subscribes"}</span>
                        {userPageUrl !== currentUserID ? <button onClick={followToogle}>{Object.values(actualUserPage.followers as Array<string>).includes(currentUserID) ? "Unfollow" : "Follow"}</button> : null}
                        {userPageUrl !== currentUserID ? <button onClick={sendMessage}>Send message</button> : null}

                    </div>
                    <div className={styles.hr}></div>
                    
                </section>
            <UserPostsList />
        </div>

    )
})

