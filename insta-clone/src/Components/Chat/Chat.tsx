import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatAPI } from "../../DAL/ChatAPI";
import { getChatsByUserID } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import { ChatType } from "../../Redux/Types";
import { getAllUsersThunk } from "../../Redux/UserSearchReducer";
import { ChatList } from "./ChatList";
import { ChatWindow, Dirrect } from "./ChatWindow";
import styles from "../../Styles/Chat.module.css"

export const Chat : React.FC = React.memo((props) => {
    const dispatch : any = useDispatch()
    useEffect(()=>{
        dispatch(getAllUsersThunk())
    },[])
 
    return (
        <section className={styles.chatWrapper}>
            <ChatList/>
            <ChatWindow/>
        </section>
    )
})
export const ChatDirrect : React.FC = React.memo((props) => {
    const dispatch : any = useDispatch()
    useEffect(()=>{
        dispatch(getAllUsersThunk())
    },[])

    return (
        <section className={styles.chatWrapper}>
            <ChatList/>
            <Dirrect/>
        </section>
    )
})