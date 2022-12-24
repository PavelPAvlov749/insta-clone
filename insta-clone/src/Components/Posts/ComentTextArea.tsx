import { Field, Form, Formik, FormikHandlers } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { leaveComentThunk } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import styles from "../../Styles/Coments.module.css"

export const ComentTextArea : React.FC = React.memo((props) => {

    let [isShowComent,setShowComent] = useState(false)
    const currentUser = useSelector((state:Global_state_type) => {
        return state.account
    })

    const postURL = useLocation().pathname.split("=")[1].split("/")[0]
    const dispatch : any = useDispatch()
    let initialFormValues = {coment : ""}

    const onSubmitHandler = ( values : {coment : string}) => {
        dispatch(leaveComentThunk(currentUser.userID as string,postURL,
            {comentatorName : currentUser.fullName,
            avatar : currentUser.avatar,
            comentatorID : currentUser.userID,
            coment_text : values.coment
        }))
        values.coment = ""
        
    }
    const showComents = () => {
        setShowComent(true)
    }

            return (
                <section className={styles.ComentInput}>
                    <Formik enableReinitialize={true} initialValues={initialFormValues} onSubmit={onSubmitHandler}>
                        <Form>
                            <Field name="coment"  type="text" autocomplete="off"></Field>
                            <br />
                            <button type="submit">Publish</button>
                        </Form>
                    </Formik>
                 
                </section>
            )
        
    
})