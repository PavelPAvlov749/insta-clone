import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getMessagesByChatID, sendMessageThunk } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import { MessageType } from "../../Redux/Types";
import styles from "../../Styles/Chat.module.css"

export const ChatWindow : React.FC = React.memo((props) => {
    const roomID = useLocation().pathname.split("=")[1]
    const currentUser = useSelector((state:Global_state_type) => {
        return state.account
    })
    const recicer = useSelector((state: Global_state_type) => {
        return state.userPage
    })
    const dispatch : any = useDispatch()
    //Active chat room selector
    const actualChat = useSelector((state:Global_state_type) => {
        return state.chat.activeChat
    })
    const messages = useSelector((state:Global_state_type) => {
        return state.chat.messages
    })

    useEffect(()=>{
        //
        dispatch(getMessagesByChatID(roomID))
    },[roomID])

    const initialFormValues = {
        newMessage : ""
    }
    const setSubmit = (values : typeof initialFormValues) => {
        dispatch(sendMessageThunk(currentUser.userID as string,actualChat as string,values.newMessage,
            currentUser.fullName as string,currentUser.avatar,recicer.avatar as string,recicer.fullName,roomID ))
    }

    return (
        <section className={styles.wrap}>
            <div >
                <h1>Messeges</h1>
                {messages.map((message:MessageType) => {
                    return (
                        <>
                        <img src={message.avatar} alt="#"></img>
                        <span>{message.fullName}</span>
                        <span>{message.messageData}</span>
                        </>

                    )
                })}
            </div>
            <div className="TextInput">
                <h1>Type text</h1>
                <Formik onSubmit={setSubmit} enableReinitialize={true} initialValues={initialFormValues}>
                    <Form>
                        <Field type="text" name="newMessage">
                        </Field>
                        <button type="submit">Send</button>
                    </Form>
                </Formik>
            </div>
        </section>
    )
})