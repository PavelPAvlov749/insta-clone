import React, { Dispatch } from "react";
import { Formik, Field, Form } from "formik";
import { Global_state_type } from "../../Redux/Store";
import { connect, useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink } from "react-router-dom";
import goole_pic from "../../Media/google_button.png";
import { loginInWithEmailAndPassword, signInWithGooglePopUp } from "../../Redux/AuthReducer";
import styles from "../../Styles/Login.module.css"




export const Login: React.FC = React.memo((props) => {
    const isError = useSelector((state: Global_state_type) => {
        return state.auth.onError
    })
    const isFetch = useSelector((state: Global_state_type) => {
        return state.app.is_fetch
    })
    let dispatch: any = useDispatch();
    let login = "";
    let password = "";
    const set_submit = (values: { login: string, password: string },) => {
        let reuslt = dispatch(loginInWithEmailAndPassword(values.login, values.password))
        console.log(reuslt)
    }
    const sign_in_with_google = () => {
        dispatch(signInWithGooglePopUp())
    }

    return (
        <div className={styles.formDivContainer}>
            <div className={styles.wrapper}>
                <h1>Login</h1>
                {isError ? <span className={styles.spanError}>Error : Invalid username or password</span> : null}
                <Formik
                    enableReinitialize={true} //<= If true Form will reinitialize after reciving new initial value from state 
                    className={styles.loginForms}
                    initialValues={{ login: login, password: password }} onSubmit={set_submit}>
                    <Form className={!isError ? styles.loginForms : styles.loginFormsError}>
                        <Field type="text" name="login" ></Field>
                        <br />
                        <Field type="text" name="password"></Field>
                        <br />
                        <hr>
                        </hr>
                        <button className={styles.loginButton} type="submit" disabled={isFetch} >Login</button>
                    </Form>

                </Formik>
                <br />
                <div>
                    <span>OR</span>
                    <br />
                    <NavLink to="/registration">Create account</NavLink>
                </div>

                <section className={styles.Sign_in_with_google}>
                    <br />

                    <button className={styles.loginButtonGoogle} type="button" onClick={sign_in_with_google} >Sign in with Google</button>
                    <img src={goole_pic} alt="#" className={styles.googleButtonImg} />

                </section>
            </div>

        </div>

    )


})

const MapStateToProps = (state: Global_state_type) => {
    return {
        is_auth: state.auth.is_auth,
        auth_token: state.auth.auth_token
    }
};
const MapDispatchToProps = (dispatch: any) => {
    return {

    }
}
export const Login_container = connect(MapStateToProps, MapDispatchToProps)(Login);