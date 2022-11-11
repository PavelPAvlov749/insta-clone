import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getChatsByUserID, getInterlocutorAvatar, getMessagesByChatID, getRealtimeMessages, getRoomByUserID, } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import styles from "../../Styles/MessageWindow.module.css"
import { Message } from "./Message";
import { TextInput } from "./TextInput";
import messageIMG from "../../Media/message.png"
import { chatAPI } from "../../DAL/ChatAPI";
import { getDatabase, onChildAdded, ref } from "firebase/database";
import messageBoxIcon from "../../Media/mailbox.png"
import { newMessagePropsType } from "../../Redux/Types";

const messageTone = require("../../Media/MessageTone.mp3")

export const Dirrect: React.FC = React.memo((props) => {

    //Chat page last message anchor 
    const chat_anchor_ref = useRef<HTMLDivElement>(null);
    const dispatch: any = useDispatch()
    let currentUser = useSelector((state: Global_state_type) => { return state.app.currentUserID })
    let activeChat = useSelector((state: Global_state_type) => { return state.chat.activeChat })
    const messages = useSelector((state: Global_state_type) => { return state.chat.messages })
    let location = useLocation().pathname.split("=")[1]

    const chat = useSelector((state: Global_state_type) => {
        return state.chat.activeChat
    })

    useEffect(() => {
        dispatch(getRoomByUserID(currentUser as string, location))
        
    }, [location])

    useEffect(() => {
        dispatch(getRealtimeMessages(location))
        // dispatch(getMessagesByChatID(location))
    }, [location])
    const interlocutorAvatar = useSelector((state: Global_state_type) => {
        return state.chat.interlocutorAvatar
    })

    return (
        <section className={styles.chatWindowWrapper}>

            <div className={styles.messageArea} >
                {messages.length > 0 ? messages.map((message) => {
                    return (
                        <div key={message.messageID}>
                              <Message messageText={message.messageText} senderID={message.userID} currentUser={currentUser} />
                        </div>
                          
                
                    )
                }) :
                    <div className={styles.noMessages}>
                        <h1>No messages yet</h1>
                        <img className={styles.mailboxIcon} src={messageBoxIcon} alt="" />
                    </div>

                }
                <div ref={chat_anchor_ref}></div>
            </div>
            <TextInput />
        </section>
    )
})


export const ChatWindow: React.FC = React.memo((props) => {

    return (
        <div className={styles.noMessage}>

            <img src={messageIMG} alt="#" />
            <br />
            <h1>Your messages</h1>
            <br />
            <span>Send personal photos and messages to a friend or group.</span>
            <br />
            <button type="button" className={styles.startChating}>Start chating</button>
        </div>

    )
})