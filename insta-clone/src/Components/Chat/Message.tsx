import React from "react";
import { NavLink } from "react-router-dom";
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

    return (
        <section   className={props.currentUserID === props.userID ? styles.currentUserMessage : styles.message}>
           
            <br />
            <span>{props.messageText} </span>
            <br />
           
        </section>
    )
})