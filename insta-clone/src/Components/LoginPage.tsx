import React, { Dispatch } from "react";
import { Formik, Field, Form } from "formik";
import {connect, useDispatch} from "react-redux";
import {Navigate, NavLink} from "react-router-dom";
import styles from '../../Styles/Login.module.css';
import goole_pic from "../../Media/google_button.png";




export const Login: React.FC = React.memo((props) => {
    let dispatch :any = useDispatch();
    let login = "";
    let password = "";
    const set_submit = (values : any) => {
        login = values.login;
        password = values.password;
    }
    
    const sign_in_with_google = ()=>{
        //@ts-ignore
        props.sign_in();
    }
    
        return (
            <div className={styles.login}>
                <h1>Login</h1>
                <Formik
                    enableReinitialize={true} //<= If true Form will reinitialize after reciving new initial value from state 
                    className="login_forms"
                    initialValues={{ login: login, password: password }} onSubmit={set_submit}>
                    <Form className={styles.form}>
                        <Field type="text" name="login" style={{
                            "borderRadius" : "3px",
                            "borderWidth" : "1px",
                        }}></Field>
                        <br />
                        <Field type="text" name="password" style={{
                            "borderRadius" : "3px",
                            "borderWidth" : "1px"
                        }}></Field>
                        <br />
                        <hr>
                        </hr>
                        <button type="submit" className={styles.submit_button}>Login</button>
                    </Form>
                    
                </Formik>
                <br />
                <div className={styles.title}>
                <span>OR</span>
                    <br />
                <NavLink to="/registration">Create account</NavLink>
                </div>
               
                <section className="Sign_in_with_google">
                    <br />
                   <div className={styles.google_login}>
                   <button type="button" onClick={sign_in_with_google} className={styles.Google}>Sign in with Google</button>
                    <img src={goole_pic} alt="#" style={{"display" : "inline-block","width": "45px" ,"height" : "40px","verticalAlign" : "middle"} } />
                   </div>
                </section>
            </div>
    
        )
    

})

