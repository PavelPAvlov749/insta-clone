import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Global_state_type } from "../../Redux/Store";
import { followTooglethunk, getUserPageByID, userPageActions } from "../../Redux/UserPageReducer";
import { UserPostsList } from "../Posts/UsersPostsList";
import { UserStatus } from "../UserStatus/Status";
import styles from "../../Styles/UserPage.module.css"
import { Avatar } from "./Avatar";

import { newChatType } from "../../Redux/Types";
import { createNewChat } from "../../Redux/ChatReducer";



export const UserPage: React.FC = React.memo(() => {
    const navigate = useNavigate()
    //Get userPageID from query string
    const userPageUrl = useLocation().pathname.split("=")[1]
    //Count of user posts 
    const publicatiponsCount = useSelector((state: Global_state_type) => {
        return state.userPosts.posts.length
    })
    //Fetch the actual user page by ID from query string
    const dispatch: any = useDispatch()
    const chats = useSelector((state:Global_state_type) => {
        return state.chat.chats
    })
    const activeChatID = useSelector((state : Global_state_type) => {
        return state.chat.activeChat
    })
    useEffect(() => {
        dispatch(getUserPageByID(userPageUrl))
    }, [userPageUrl,activeChatID])

    const currentUserID = useSelector((state: Global_state_type) => {
        return state.app.currentUserID
    })
    const currentUserAvatar = useSelector((state : Global_state_type) => {
        return state.account.avatar
    })
    const currentUSerFullName = useSelector((state: Global_state_type) => {
        return state.account.fullName
    })


    const actualUserPage = useSelector((state: Global_state_type) => {
        return state.userPage
    })
    //Status update handler aloowed only on current user page
    const setNewStatus = (userID: string, status: string) => {
        dispatch(userPageActions.setStatus(status))
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
        const newChat : newChatType = {
            sender : {
                senderID : currentUserID,
                senderFullName : currentUSerFullName as string,
                avatar : currentUserAvatar

            },
            recepient : {
                recepientID : actualUserPage.userID,
                recepientFullName : actualUserPage.fullName,
                avatar : actualUserPage.avatar
            }
        }
        
        let chat = chats.find((chat : any) => chat.userID == actualUserPage.userID)
        if(chat){
            navigate(`/chat/id:=${chat.chatID}`)
        }else{
            dispatch(createNewChat(newChat))
            if(activeChatID){
                navigate(`/chat/id:=${activeChatID}`)
            }
            
        }
      
    }
    return (
        <div className={styles.userPageContainr}>
            <section className={styles.userPageWrapper} >
                <Avatar avatarIMG={actualUserPage.avatar} userID={actualUserPage.userID} fullName={actualUserPage.fullName} size={"large"} />

                <br />

                <h1 className={styles.fullName}>{actualUserPage.fullName}</h1>


                <div className={styles.info}>
                    {userPageUrl === currentUserID ? <UserStatus status={actualUserPage.status} userID={userPageUrl}
                        setNewStatus={setNewStatus} /> : <p className={styles.status}>{actualUserPage.status}</p>}
                    <div className={styles.publications}>
                        <span>{publicatiponsCount}</span>
                        <br></br>
                        <span >{"Posts"}</span>
                    </div>
                    <NavLink to={"./followers"}>
                        <div className={styles.Follower}>
                            <span>{actualUserPage.followers?.length}</span>
                            <br></br>
                            <span >{"Follower"}</span>
                        </div>
                    </NavLink>
                    <NavLink to={"./Followed"}>
                        <div className={styles.Followed}>
                            <span>{actualUserPage.subscribes?.length}</span>
                            <br></br>
                            <span >{"Followed"}</span>
                        </div>
                    </NavLink>

                </div>
                {userPageUrl !== currentUserID ?
                    <section className={styles.contrtolButtons}>
                        {userPageUrl !== currentUserID ? <button onClick={followToogle}>{Object.values(actualUserPage.followers as Array<string>).includes(currentUserID) ? "Unfollow" : "Follow"}</button> : null}
                        {userPageUrl !== currentUserID ? <button onClick={sendMessage}>Send message</button> : null}
                    </section> : null
                }

            </section>
            <UserPostsList />
        </div>

    )
})
