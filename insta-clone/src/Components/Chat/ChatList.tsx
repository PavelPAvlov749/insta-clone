import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Global_state_type } from "../../Redux/Store";
import { getAllUsersThunk } from "../../Redux/UserSearchReducer";
// import styles from "../../Styles/Chat.module.css"
import styles from "../../Styles/ChatList.module.css"
import { Preloader } from "../Preloader/Preloader";
import { Avatar } from "../UserPage/Avatar";
import { LineLoader } from "../UserSearch/LoaderLine";
import emptyChatList from "../../Media/no-chatting.png"
import { chatAPI } from "../../DAL/ChatAPI";

export const ChatList: React.FC = React.memo((props) => {

    const navigate = useNavigate()
    const dispatch: any = useDispatch()
    useEffect(() => {
        dispatch(getAllUsersThunk())
    }, [])

    let isFetch = useSelector((state: Global_state_type) => {
        return state.app.is_fetch
    })

    const users = useSelector((state: Global_state_type) => {
        return state.search.users
    })
    //Current userId Selector.Fetch chat list by this userID then dispatch them into state
    //And get them with useEffect
    const currentUserID = useSelector((state: Global_state_type) => {
        return state.account
    })
    //Get chats from state
    const Chats = useSelector((state: Global_state_type) => {
        return state.chat.chats
    })
    useEffect(() => {
        chatAPI.getListOfChatsByUserID(currentUserID.userID as string)
    },[])
    const onClickHandler = (userID: string, avatar: string, fullName: string) => {
        //On chatlist click handler function
        // dispatch(chat_actions.setActiveChat(userID, avatar, fullName))
        navigate("/chat/id:=" + userID)

    }

    if (!isFetch) {
        return (
            <section className={styles.chatListWrapper}>
                {Chats?.length > 0 ? <section>
                    {users?.map((user) => {
                        return (
                            <div className={styles.userMiniPage} key={user.userID} onClick={() => {
                                onClickHandler(user.userID, user.avatar, user.fullName)
                            }}>

                                <Avatar avatarIMG={user.avatar} userID={user.userID} fullName={user.fullName} size={"small"} />
                                <span className={styles.chatListFullName}>{user.fullName}</span>
                            </div>
                        )
                    })}
                </section> : 
                <figure className={styles.emptyChatList}>
                    <h1>Sorry,looks like you dont have any chats yet</h1>
                    <img src={emptyChatList} alt={"#"}></img>   
                    </figure>}
            </section>
        )
    } else {
        return (
            <>
                <Preloader />
            </>
        )
    }

})