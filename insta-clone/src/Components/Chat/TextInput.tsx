import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { sendMessageThunk } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import styles from "../../Styles/TextInput.module.css"
import emojiPNG from "../../Media/emoji.png"






export const TextInput: React.FC = React.memo((props) => {
    const dispatch: any = useDispatch()
    let currentUser = useSelector((state: Global_state_type) => { return state.account })
    const [newMessageText, setNewMessageText] = useState("")
    let location = useLocation().pathname.split("=")[1]
    const initialFormValues = { newMessage: newMessageText }


    const setSubmit = (values: typeof initialFormValues) => {
        if(values.newMessage.length === 0) {
            console.error("messsage cannot be an empty string")
            
        }else{
            dispatch(sendMessageThunk(currentUser.userID as string, location, values.newMessage, currentUser.fullName as string,))
            setNewMessageText("")
        }

    }
    const OnChangeHandler = (e: React.UIEvent<HTMLInputElement, UIEvent>) => {
        setNewMessageText(e.currentTarget.value)
    }
    return (
        <footer>
            <div className={styles.inputWrapper}>
              
                    <img src={emojiPNG} alt="#" className={styles.emoji}></img>
                    <Formik onSubmit={setSubmit} enableReinitialize={true} initialValues={initialFormValues} >
                        <Form className={styles.formik}>
                            <Field type="text" name="newMessage" autocomplete="off" onChange={OnChangeHandler}
                                value={newMessageText} className={styles.messageInput} >
                            </Field>
                            <button type="submit" className={styles.textArea}>Send</button>
                        </Form>
                    </Formik>


            </div>
        </footer>
    )
})