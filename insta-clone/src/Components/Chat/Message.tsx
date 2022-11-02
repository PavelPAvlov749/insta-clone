import React, { Ref, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { chatAPI } from "../../DAL/ChatAPI";
import styles from "../../Styles/Message.module.css"
import { Avatar } from "../UserPage/Avatar";

type MessagePropsType = {
    messageText: string,
    userName: string,
    userID: string,
    currentUserID : string,
    avatar : string | null
}

export const Message: React.FC<MessagePropsType> = React.memo((props) => {
    if(props.userID !== props.currentUserID){
        chatAPI.decrementUnreadedMessagesCount(props.currentUserID)
    }
    
    return (
        <section className={props.currentUserID === props.userID ? styles.currentUserMessage : styles.message}>
           
            <br />
            <span >{props.messageText} </span>
            <br />
           
        </section>
    )
})