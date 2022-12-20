import React  from "react";

import { chatAPI } from "../../DAL/ChatAPI";

import styles from "../../Styles/Message.module.css"



export const Message: React.FC<{messageText : string,currentUser : string | null,senderID : string | null}> = React.memo((props) => {
    if(props.senderID !== props.currentUser){
        chatAPI.decrementUnreadedMessagesCount(props.currentUser as string)
    }
    return (
        <div className={props.currentUser === props.senderID ? styles.currentUserMessage : styles.message}>
            <span >{props.messageText} </span>
        </div>
    )
})