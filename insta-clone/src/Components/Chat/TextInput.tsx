import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { sendMessageThunk } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import styles from "../../Styles/Chat.module.css"
import emojiPNG from "../../Media/emoji.png"



export const TextInput: React.FC = React.memo((props) => {
    const dispatch: any = useDispatch()
    //Get current user
    let currentUser = useSelector((state: Global_state_type) => { return state.account })
    //Local stat for new message
    const [newMessageText, setNewMessageText] = useState("")
    //Get roomID from query string
    let location = useLocation().pathname.split("=")[1]
    //Initial values to input
    const initialFormValues = { newMessage: newMessageText }
    //Current chatRoom 
    const actualChat = useSelector((state : Global_state_type) => {
        return state.chat.activeChat
    })
    //actual chat contains an array of objects containig userID and avatar of user with this ID
    //Find the recepient avatar by Array.find element with id not equals to current user ID
    let recepientAvatar = actualChat?.avatars?.find((el) => el.userID !== currentUser.userID)

    //Submitting function 
    const setSubmit = (values: typeof initialFormValues) => {
        if(values.newMessage.length === 0) {
            console.error("messsage cannot be an empty string")
        }else{
            dispatch(sendMessageThunk(currentUser.userID as string,currentUser.fullName as string, values.newMessage, location,recepientAvatar?.userID as string,actualChat.recepientFullNAme,
                currentUser.avatar,recepientAvatar?.avatar as string))
            //Set in input empty string after sending the message
            setNewMessageText("")
        }

    }
    //On inut change handler function 
    const OnChangeHandler = (e: React.UIEvent<HTMLInputElement, UIEvent>) => {
        setNewMessageText(e.currentTarget.value)
    }

    return (
        <section className={styles.inputWrapper}>
                    <img src={emojiPNG} alt="#" className={styles.emoji}></img>
                    <Formik onSubmit={setSubmit} enableReinitialize={true} initialValues={initialFormValues} >
                        <Form className={styles.formik}>
                            <Field type="text" name="newMessage" autoComplete="off" autoFocus="on" onChange={OnChangeHandler}
                                value={newMessageText} className={styles.messageInput} >    
                            </Field>
                            <button type="submit" className={styles.textArea}>Send</button>
                        </Form>
                    </Formik>
        </section>
    )
})