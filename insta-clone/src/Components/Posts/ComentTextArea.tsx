import { Field, Form, Formik, FormikHandlers } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { leaveComentThunk } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";


export const ComentTextArea : React.FC = React.memo((props) => {
    const currentUserID = useSelector((state:Global_state_type) => {
        return state.auth.user_id
    })
    const currentUser = useSelector((state:Global_state_type) => {
        return state.account
    })

    const postURL = useLocation().pathname.split("=")[1]
    const dispatch : any = useDispatch()
    let initialFormValues = {coment : ""}

    const newPostText = useSelector((state: Global_state_type) => {
        return state.userPosts
    })

    
    const setSubmit = () => {

    }
    const onSubmitHandler = ( values : {coment : string}) => {
        dispatch(leaveComentThunk(currentUser.userID as string,postURL,
            {comentatorName : currentUser.fullName,
            comentatorAvatar : currentUser.avatar,
            comentatorID : currentUser.userID,
            coment_text : values.coment
        }))
        console.log(values.coment)
    }

        return (
        <section className="ComentInputContainer">
            <h3>Leave the coment : </h3>
            <Formik enableReinitialize={true} initialValues={initialFormValues} onSubmit={onSubmitHandler}>
                <Form>
                    <Field name="coment"  type="text"></Field>
                    <button type="submit">Publish</button>
                </Form>
            </Formik>
         
        </section>
    )
})