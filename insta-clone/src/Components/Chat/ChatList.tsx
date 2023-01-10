//REACT & REACT HOOKS IMPORTS
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
//TYPES
import { Global_state_type } from "../../Redux/Store";
import { chatRoomType } from "../../Redux/Types";
//STYLES
import styles from "../../Styles/Chat.module.css"
//MEDIA & ASSETS
import emptyChatList from "../../Media/no-chatting.png"
//THUNK IMPORTS
import { chat_actions, getChatsByUserID } from "../../Redux/ChatReducer";





//THIS COMPONENT WILL RENDER USER LIST OF CHATS IF USER DOSENT HAVE ANY CHATS COMPOENTN WILL RENDER PICTURE AND MESSAGE
//NO CHATS YET
export const ChatList: React.FC = React.memo((props) => {

    const navigate = useNavigate()
    const dispatch: any = useDispatch()
    const location = useLocation().pathname
    //Current user page
    const currentUSerPage = useSelector((state: Global_state_type) => {
        return state.userPage
    })
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
    const onClickHandler = (chat: chatRoomType) => {
        //On chatlist click handler function

        dispatch(chat_actions.setActiveChat(chat))
        navigate("/chat/id:=" + chat.roomID)

    }
    
    return (
        < div className={!location.includes("id") ? styles.chatListWrapper : styles.chatListSidebar}>
            {Chats?.length > 0 ? <section >
                {Chats?.map((chat: chatRoomType) => {
                let chatIMG = chat.avatars.find((el) => el.userID !== currentUSerPage.userID)?.avatar
                    return (
                        <div className={styles.userMini} onClick={() => { onClickHandler(chat) }}>
                            <img title="img" src={chatIMG} style={{ "width": "45px", "height": "45px", "borderRadius": "180px", "lineHeight": "45px", "verticalAlign": "middle" }}></img>
                           <ul>
                            <li>
                                <span>{"\t" + chat.recepientFullNAme}</span>
                            </li>
                            <li>
                            <span className={styles.lastMessage}>{chat.lastMessage}</span>
                            <div className={styles.countWrapper}>
                            <span className={styles.count}>{chat.unreadedMessages}</span>
                            </div>
                         
                            </li>
                            <li>
                           
                            </li>
                           </ul>


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