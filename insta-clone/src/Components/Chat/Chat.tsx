//REACT IMPORTS
import React from "react";
//COMPONENTS
import { ChatList } from "./ChatList";
import { Dirrect } from "./ChatWindow";
//STYLES
import styles from "../../Styles/Chat.module.css"

//Chat window wrapper component
export const Chat : React.FC = React.memo((props) => {

    return (
        <section className={styles.chatWrapper}>
            <h1 className={styles.chatHeader}>Messenger</h1>
            <section className={styles.chatContent}>
            <ChatList/>
            <Dirrect/>
            </section>
           
        </section>
    )
})

