import React  from "react";
import { firestoreChat } from "../../DAL/FirestoreChatAPI";

import styles from "../../Styles/Message.module.css"


//SINGLE MESSAGE COMPONENT
export const Message: React.FC<{messageText : string,currentUser : string | null,senderID : string | null,roomID : string}> = React.memo((props) => {
    if(props.senderID !== props.currentUser){
        //Decrement undreaded message
        firestoreChat.decrementUnreadedMessagesCount(props.roomID)
    }
    return (
        <div className={props.currentUser === props.senderID ? styles.currentUserMessage : styles.message}>
            <span >{props.messageText} </span>
        </div>
    )
})