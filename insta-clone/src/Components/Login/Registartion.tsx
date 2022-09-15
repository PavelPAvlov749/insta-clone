import React from "react";
import { Formik, Field, Form } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUserByEmailAndPassword } from "../../Redux/AuthReducer";
import styles from "../../Styles/Registration.module.css"


export const Registration: React.FC = React.memo((props) => {
    const dispatch:any = useDispatch()
    const navigate = useNavigate()

    const setSubmit = (values : {username : string,login : string,password : string}) => {
       dispatch(createUserByEmailAndPassword(values.login,values.password,values.username))

    }
    return (
        <section className={styles.container}>
            <h1>Registration</h1>
            <hr />
            <h3>Step 1 :</h3>
            <Formik
                enableReinitialize={true} //<= If true Form will reinitialize after reciving new initial value from state 
                className="login_forms"
                initialValues={{ username : "" , login : "" , password : "" }} onSubmit={setSubmit}>
                    
                <Form className={styles.loginForms}>
                    <div className={styles.loginFormsDIV}>
                    <span>Type your name : </span>
                    <Field type="text" name="username"></Field>
                    <br />
                    <span>Login : </span>
                    <Field type="text" name="login"></Field>
                    <br />
                    <span>Password : </span>
                    <Field type="text" name="password"></Field>
                    <br />
                    </div>
                    <div className={styles.hrReg}></div>
                    <button type="submit" className={styles.registrationButton} >Create Acount</button>
                    <br />
                </Form>
            </Formik>
        </section>
    )
})