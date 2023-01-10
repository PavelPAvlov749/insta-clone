import { Form, Formik, Field } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { app_actions } from "../../Redux/AppReducer";
import { chat_actions, sendMessageFromModalWindow } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import { newChatType } from "../../Redux/Types";
import styles from "../../Styles/NewMessageModalWindow.module.css"
import { Avatar } from "../UserPage/Avatar";


export const ModalWindow: React.FC = React.memo((props) => {
    const dispatch: any = useDispatch()
    //New message text pocmes from field change handler
    const newMessageText = useSelector((state: Global_state_type) => {
        return state.chat.newMessage
    })
    //Current (Logged in) user
    const currentUser = useSelector((state: Global_state_type) => {
        return state.account
    })
    //Actual user Page
    const actualPage = useSelector((state: Global_state_type) => {
        return state.userPage
    })

    const sendMessageHandler = () => {
        //If chat with cyrrent user does not exist function senMessageFromModalWindow will create it by this object
        const newChat: newChatType = {
            sender: {
                senderID: currentUser.userID as string,
                senderFullName: currentUser.fullName as string,
                avatar: currentUser.avatar
            },
            recepient: {
                recepientID: actualPage.userID,
                recepientFullName: actualPage.fullName,
                avatar: actualPage.avatar
            }
        }
        dispatch(sendMessageFromModalWindow(newChat, newMessageText))
        dispatch(app_actions.setOnNewMessage(false))

    }
    //Cose modal windiow
    const closeButtonHandler = () => {
        dispatch(app_actions.setOnNewMessage(false))
    }
    //Set changes from input field to redux state
    const onFieldChatngeHandler = (e: any) => {
        dispatch(chat_actions.setNewMessage(e.currentTarget.value))
    }
    return (
        <div className={styles.blur}>
            <section className={styles.modalWindowContainer}>

                <Avatar avatarIMG={actualPage.avatar} userID={actualPage.userID} fullName={actualPage.fullName} size="small" />
                <span>{actualPage.fullName}</span>
                <hr />
                <br />
                <Formik
                    enableReinitialize={true}
                    initialValues={{ messageText: null }}
                    onSubmit={sendMessageHandler}
                >
                    <Form>
                        <textarea title="Type your message" rows={11} name="messageText" autoFocus={true} onChange={onFieldChatngeHandler}></textarea>
                        <br />
                        <div className={styles.buttons}>
                            <button onClick={closeButtonHandler}>Close</button>
                            <button type="submit" disabled={newMessageText.length < 1} >Send</button>
                        </div>
                    </Form>
                </Formik>

            </section>
        </div>
    )
})