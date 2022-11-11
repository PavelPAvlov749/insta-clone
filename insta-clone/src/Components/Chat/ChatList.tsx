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
import { getChatsByUserID } from "../../Redux/ChatReducer";

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
        dispatch(getChatsByUserID(currentUserID.userID as string))
    },[])
    const onClickHandler = (userID:string) => {
        //On chatlist click handler function
        // dispatch(chat_actions.setActiveChat(userID, avatar, fullName))
        navigate("/chat/id:=" + userID)

    }

    if (!isFetch) {
        return (
            <section className={styles.chatListWrapper}>
                {Chats?.length > 0 ? <section>
                    {Chats?.map((chat) => {
                        return (
                            <div onClick={() => {onClickHandler(chat.chatID)}}>
                                <img style={{"width" : "60px","height" : "60px","borderRadius" : "180px"}} src={chat.avatar} alt="#"></img>
                                <span>{chat.fullName}</span>
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