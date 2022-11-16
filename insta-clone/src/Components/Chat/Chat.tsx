//REACT IMPORTS
import React from "react";
//COMPONENTS
import { ChatList } from "./ChatList";
import { ChatWindow, Dirrect } from "./ChatWindow";
//STYLES
import styles from "../../Styles/Chat.module.css"



//CHAT COMPONENT WILL RENDERS ONLY ON MOBILE DEVISES
export const Chat : React.FC = React.memo((props) => {


    return (
        <section className={styles.chatWrapper}>
            <h1 className={styles.chatHeader}>Messenger</h1>
            
            <ChatList/>
            <ChatWindow/>
        </section>
    )
})

//THIS CHAT COMPONENT WILL RENDERED ONLY ON BIG SCREENS 
export const ChatDirrect : React.FC = React.memo((props) => {
  


    return (
        <section className={styles.chatWrapper}>
            <h1 className={styles.chatHeader}>Messenger</h1>
            
            <ChatList/>
            <Dirrect/>
        </section>
    )
})