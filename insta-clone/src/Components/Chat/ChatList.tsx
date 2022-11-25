//REACT & REACT HOOKS IMPORTS
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
//TYPES
import { Global_state_type } from "../../Redux/Store";
//STYLES
import styles from "../../Styles/Chat.module.css"
//COMPONENTS
import { Avatar } from "../UserPage/Avatar";
//MEDIA & ASSETS
import messageIMG from "../../Media/message.png"
import emptyChatList from "../../Media/no-chatting.png"
//THUNK IMPORTS
import { getChatsByUserID } from "../../Redux/ChatReducer";
import { TextInput } from "./TextInput";



//THIS COMPONENT WILL RENDER USER LIST OF CHATS IF USER DOSENT HAVE ANY CHATS COMPOENTN WILL RENDER PICTURE AND MESSAGE
//NO CHATS YET
export const ChatList: React.FC = React.memo((props) => {

    const navigate = useNavigate()
    const dispatch: any = useDispatch()
    const location = useLocation().pathname

    //Current userId Selector.Fetch chat list by this userID then dispatch them into state
    //And get them with useEffect
    const currentUserID = useSelector((state: Global_state_type) => {
        return state.account
    })
    //Get chats from state
    const Chats = useSelector((state: Global_state_type) => {
        return state.chat.chats
    })
    useEffect(() => {
        dispatch(getChatsByUserID(currentUserID.userID as string))
    }, [])
    const onClickHandler = (userID: string) => {
        //On chatlist click handler function
        // dispatch(chat_actions.setActiveChat(userID, avatar, fullName))
        navigate("/chat/id:=" + userID)

    }

    return (
        < div className={!location.includes("id") ? styles.chatListWrapper : styles.chatListSidebar}>
            {Chats?.length > 0 ? <section >
                {Chats?.map((chat) => {
                    return (

                        <div className={styles.userMini} onClick={() => { onClickHandler(chat.chatID) }}>
                            <Avatar fullName={chat.fullName} avatarIMG={chat.avatar} size="small" />

                            <span>{"\t" + chat.fullName}</span>
                        </div>

                    )
                })}

            </section> :
                <figure className={styles.emptyChatList}>
                    <h1>Sorry,looks like you dont have any chats yet</h1>
                    <img src={emptyChatList} alt={"#"}></img>
                </figure>}
         
        </div>
    )

})