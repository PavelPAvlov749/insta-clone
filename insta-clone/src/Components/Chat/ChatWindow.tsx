import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { chatReducer, chat_actions, getRealtimeMessages, getRoomByUserID, } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import styles from "../../Styles/Chat.module.css"
import { Message } from "./Message";
import { TextInput } from "./TextInput";
import messageIMG from "../../Media/message.png"
import messageBoxIcon from "../../Media/mailbox.png"
import { ChatList } from "./ChatList";


const messageTone = require("../../Media/MessageTone.mp3")

export const Dirrect: React.FC = React.memo((props) => {

    //Chat page last message anchor 
    const chat_anchor_ref = useRef<HTMLDivElement>(null);
    const dispatch: any = useDispatch()
    let currentUser = useSelector((state: Global_state_type) => { return state.app.currentUserID })
    const messages = useSelector((state: Global_state_type) => { return state.chat.messages })
    let location = useLocation().pathname.split("=")[1]
    const path = useLocation().pathname
    console.log(path.includes("id"))
    useEffect(() => {
        dispatch(getRoomByUserID(currentUser as string, location))

    }, [location])
    useEffect(() => {
        dispatch(getRealtimeMessages(location))
        dispatch(chat_actions.setActiveChat(location))
    }, [location])
    if (path.includes("id")) {
        return (
            <section className={styles.messageAreaContainer}>

                <div className={styles.messageArea} >
                    {messages.length > 0 ? messages.map((message) => {
                        return (
                            <div key={message.messageID}>
                                <Message messageText={message.messageText} senderID={message.senderID} currentUser={currentUser} />
                            </div>

                        )
                    }) :
                        <div className={styles.noMessages}>
                            <img className={styles.mailboxIcon} src={messageBoxIcon} alt="" />
                            <h1>No messages yet</h1>
                
                        </div>

                    }
                    <div ref={chat_anchor_ref}></div>
                   
                </div>
                <TextInput/>
            </section>
        )
    } else {
        return (
            <div className={styles.chatMain}>

                <img className={styles.emptyChatIMG} src={messageIMG} alt="#" />
                <br />
                <h1>Your messages</h1>
                <br />
                <span>Send personal photos and messages to a friend or group.</span>
                <br />
                <TextInput/>
            </div>

        )
    }

})


