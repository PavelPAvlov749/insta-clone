import React  from "react";

import { chatAPI } from "../../DAL/ChatAPI";

import styles from "../../Styles/Message.module.css"



export const Message: React.FC<{messageText : string,currentUser : string,senderID : string}> = React.memo((props) => {
    if(props.senderID !== props.currentUser){
        chatAPI.decrementUnreadedMessagesCount(props.currentUser)
    }
    return (
        <div className={props.currentUser === props.senderID ? styles.currentUserMessage : styles.message}>
            <span >{props.messageText} </span>
        </div>
    )
})