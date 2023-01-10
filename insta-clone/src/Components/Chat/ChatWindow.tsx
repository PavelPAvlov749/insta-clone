import React, { useEffect, useRef,} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getRealtimeMessages, } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import styles from "../../Styles/Chat.module.css"
import { Message } from "./Message";
import { TextInput } from "./TextInput";
import messageIMG from "../../Media/message.png"
import messageBoxIcon from "../../Media/mailbox.png"


const messageTone = require("../../Media/MessageTone.mp3")

export const Dirrect: React.FC = React.memo((props) => {

    //Chat page last message anchor 
    const chat_anchor_ref = useRef<HTMLDivElement>(null);
    const dispatch: any = useDispatch()
    
    let currentUser = useSelector((state: Global_state_type) => { return state.app.currentUserID })
    const messages = useSelector((state: Global_state_type) => { return state.chat.messages })
    //Get room id from query string into path
    let location = useLocation().pathname.split("=")[1]
    const path = useLocation().pathname



    //Get actual dialog merssages called everytime when location or masseges.length are chanhed
    useEffect(() => {
        dispatch(getRealtimeMessages(location))
    }, [location,messages.length])

    if (path.includes("id")) {
        return (
            <section className={styles.messageAreaContainer}>

                <div className={styles.messageArea} >
                    {messages?.length > 0 ? messages.map((message : any) => {
                        return (
                            <div>
                                <Message messageText={message?.messageText} senderID={message?.creatorID} currentUser={currentUser} roomID={location} />
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


