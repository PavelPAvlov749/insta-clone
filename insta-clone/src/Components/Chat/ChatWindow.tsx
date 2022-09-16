import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {  getMessagesByChatID, } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import styles from "../../Styles/MessageWindow.module.css"
import { Message } from "./Message";
import { TextInput } from "./TextInput";
import messageIMG from "../../Media/message.png"


export const Dirrect : React.FC = React.memo((props) => {
    
    //Chat page last message anchor 
    const chat_anchor_ref = useRef<HTMLDivElement>(null);

    const dispatch: any = useDispatch()
    let currentUser = useSelector((state: Global_state_type) => { return state.account })
    const messages = useSelector((state: Global_state_type) => { return state.chat.messages })

    let location = useLocation().pathname.split("=")[1]


    useEffect(() => {
        dispatch(getMessagesByChatID(currentUser.userID as string, location))

    }, [location])

    return (
        <section className={styles.chatWindowWrapper}>
        <div className={styles.messageArea} >
            {messages.length > 0 ? messages.map((message) => {
                return (
                    <>
                        <Message userName={message.fullName} avatar={message.avatar} userID={message.userID}
                            messageText={message.messageData} currentUserID={currentUser.userID as string} />
                    </>
                )
            }) : 
                <span>No messages</span>
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