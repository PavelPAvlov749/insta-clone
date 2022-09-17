import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { chat_actions, getChatsByUserID, getMessagesByChatID, getRoomByUserID } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import { UserType } from "../../Redux/Types";
// import styles from "../../Styles/Chat.module.css"
import styles from "../../Styles/ChatList.module.css"
import { MiniProfile } from "../MiniProfile/MiniProfile";

const defaultAvatar = "http://www.faadooengineers.com/fests/wp-content/uploads/Tesseract-2017-Gurunanak-Institute-of-Technology.jpg"
export const ChatList: React.FC = React.memo((props) => {
    const activeChat = useSelector((state: Global_state_type) => {
        return state.chat.activeChat
    })
 
    const navigate = useNavigate()
    const dispatch: any = useDispatch()
    const bubleSort = (array: Array<UserType>) => {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length; j++) {

            }
        }
    }
    const users = useSelector((state: Global_state_type) => {
        return state.search.users
    })
    //Current userId Selector.Fetch chat list by this userID then dispatch them into state
    //And get them with useEffect
    const currentUserID = useSelector((state: Global_state_type) => {
        return state.account
    })
    //Get chats from state
    const Chats = useSelector((state: Global_state_type) => {
        return state.userPage.chats
    })

    const onClickHandler = (userID: string, avatar: string, fullName: string) => {
        //On chatlist click handler function
        dispatch(getRoomByUserID(currentUserID.userID as string, userID))
        dispatch(chat_actions.setActiveChat(userID, avatar, fullName))
        dispatch(chat_actions.getMessages([]))
        navigate("/chat/id:=" + userID)

    }

    if (Chats !== null) {
        return (
            <section className={styles.chatListWrapper}>
                {users?.map((user) => {
                 
                    return (
                        <div className={styles.userMiniPage} key={user.userID} onClick={() => {
                            onClickHandler(user.userID, user.avatar, user.fullName)
                        }}>
                            
                                <img src={user.avatar ? user.avatar : defaultAvatar} alt="#" ></img>
                                <span>{user.fullName}</span>

  

                        </div>
                    )
                })}
            </section>
        )
    } else {
        return (
            <>
                <h1>Fetch data...</h1>
            </>
        )
    }

})