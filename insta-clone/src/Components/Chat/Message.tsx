import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../../Styles/Message.module.css"

type MessagePropsType = {
    messageText: string,
    userName: string,
    userID: string,
    currentUserID : string
}

export const Message: React.FC<MessagePropsType> = React.memo((props) => {
    
    return (
        <section   className={props.currentUserID === props.userID ? styles.currentUserMessage : styles.message}>
           
            <NavLink to={`/profile/id=${props.userID}`}>
                {/* <img src={props.avatar ? props.avatar : "#"} alt="#" className={props.currentUserID === props.userID ? styles.currentAvatar : styles.avatar}></img> */}
            </NavLink>
            <br />
            <span>{props.messageText} </span>
            <br />
           
        </section>
    )
})