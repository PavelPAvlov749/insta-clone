import React, { Ref, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { chatAPI } from "../../DAL/ChatAPI";
import { newMessagePropsType } from "../../Redux/Types";
import styles from "../../Styles/Message.module.css"
import { Avatar } from "../UserPage/Avatar";


export const Message: React.FC<{messageText : string,currentUser : string,senderID : string}> = React.memo((props) => {
    if(props.senderID !== props.currentUser){
        chatAPI.decrementUnreadedMessagesCount(props.currentUser)
    }
    
    return (
        <section className={props.currentUser === props.senderID ? styles.currentUserMessage : styles.message}>
           
            <br />
            <span >{props.messageText} </span>
            <br />
           
        </section>
    )
})