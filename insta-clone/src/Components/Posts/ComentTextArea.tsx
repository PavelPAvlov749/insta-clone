import { Field, Form, Formik } from "formik";
import React from "react";


export const ComentTextArea : React.FC = React.memo((props) => {
    let newComentText = ""
    const setSubmit = () => {

    }
    const onFormErrorHandler = () => {

    }
    return (
        <div>
            <Formik initialValues={{newComent : newComentText}} enableReinitialize={true} onSubmit={setSubmit} >
                <Form onError={onFormErrorHandler}>
                    <Field type="text" name="newComent"></Field>
                    <button type="button">send</button>
                </Form>

            </Formik>
        </div>
    )
})