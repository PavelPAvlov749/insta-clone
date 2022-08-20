import React from "react";
import { Formik, Field, Form } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/Registration.module.css"



export const Registration: React.FC = React.memo((props) => {
    const dispatch:any = useDispatch()
    const navigate = useNavigate()

    const setSubmit = (values : {username : string,login : string,password : string}) => {
        

    }
    return (
        <section className={styles.Registration}>
            <h1>Registration</h1>
            <Formik
                enableReinitialize={true} //<= If true Form will reinitialize after reciving new initial value from state 
                className="login_forms"
                initialValues={{ username : "" , login : "" , password : "" }} onSubmit={setSubmit}>
                <Form >
                    <span>Type your name : </span>
                    <Field type="text" name="username"></Field>
                    <br />
                    <span>Login : </span>
                    <Field type="text" name="login"></Field>
                    <br />
                    <span>Password : </span>
                    <Field type="text" name="password"></Field>
                    <br />
                    <button type="submit" >Create Acount</button>
                </Form>
            </Formik>
        </section>
    )
})