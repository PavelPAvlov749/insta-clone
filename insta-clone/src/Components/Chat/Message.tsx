import React  from "react";

import { chatAPI } from "../../DAL/ChatAPI";

import styles from "../../Styles/Message.module.css"



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