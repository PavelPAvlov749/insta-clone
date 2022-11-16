import React from "react";
import { ChatList } from "./ChatList";
import { ChatWindow, Dirrect } from "./ChatWindow";
import styles from "../../Styles/Chat.module.css"

export const Chat : React.FC = React.memo((props) => {


    return (
        <section className={styles.chatWrapper}>
            <h1 className={styles.chatHeader}>Messenger</h1>
            
            <ChatList/>
            <ChatWindow/>
        </section>
    )
})
export const ChatDirrect : React.FC = React.memo((props) => {
  


    return (
        <section className={styles.chatWrapper}>
            <h1 className={styles.chatHeader}>Messenger</h1>
            
            <ChatList/>
            <Dirrect/>
        </section>
    )
})