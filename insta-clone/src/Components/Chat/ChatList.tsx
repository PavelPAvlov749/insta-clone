import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appReducer, app_actions } from "../../Redux/AppReducer";
import { chat_actions, getChatsByUserID, getMessagesByChatID } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import { ChatType } from "../../Redux/Types";
import { MiniProfile } from "../MiniProfile/MiniProfile";
import { Chat } from "./Chat";


export const ChatList: React.FC = React.memo((props) => {
    const navigate = useNavigate()
    const dispatch : any= useDispatch()
    //Current userId Selector.Fetch chat list by this userID then dispatch them into state
    //And get them with useEffect
    const currentUserID = useSelector((state:Global_state_type) => {
        return state.account
    })
    //Get chats from state
    const Chats = useSelector((state:Global_state_type) => {
        return state.chat.chats
    })
    const currentChat = useSelector((state:Global_state_type) => {
        return state.chat.activeChat
    })
    useEffect(() => {
        dispatch(getChatsByUserID(currentUserID.userID as string))
    }, [Chats])

    const onClickHandler = (chatID: string) => {
        //On chatlist click handler function
        //Dispatch set active chat list
        navigate("/chat/id:=" + currentChat)
        dispatch(chat_actions.setActiveChat(chatID))
    }
    return (
        <section style={{"display" : "inline"}}>
            <h1>Chat list</h1>
            {Chats?.map((user : ChatType) => {
                return (
                    <div onClick={() =>{
                        onClickHandler(user.chatRef)
                    }}>
                        <img src={user.avatar} alt="#"></img>
                        <span>{user.fullName}</span>
                    </div>
                )
            })}
        </section>
    )
})