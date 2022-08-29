import React, { Dispatch } from "react";
import { Formik, Field, Form } from "formik";
import { Global_state_type } from "../../Redux/Store";
import { connect, useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink } from "react-router-dom";
import goole_pic from "../../Media/google_button.png";
import { loginInWithEmailAndPassword, signInWithGooglePopUp } from "../../Redux/AuthReducer";




export const Login: React.FC = React.memo((props) => {
    const isError = useSelector((state: Global_state_type) => {
        return state.auth.onError
    })
    let dispatch: any = useDispatch();
    let login = "";
    let password = "";
    const set_submit = (values: { login: string, password: string },) => {
        dispatch(loginInWithEmailAndPassword(values.login, values.password))
    }
    const sign_in_with_google = () => {
        dispatch(signInWithGooglePopUp())
    }

    return (
        <div >
            <h1>Login</h1>
            {isError ? <span style={{"color" : "red"}}>Error : Invalid username or password</span> : null}
            <Formik
                enableReinitialize={true} //<= If true Form will reinitialize after reciving new initial value from state 
                className="login_forms"
                initialValues={{ login: login, password: password }} onSubmit={set_submit}>
                <Form >
                    <Field type="text" name="login" style={!isError ? {
                        "borderRadius": "3px",
                        "borderWidth": "1px",
                    } : {
                        "borderRadius": "4px",
                        "borderWidth": "1px", "borderColor": "red"
                    }}></Field>
                    <br />
                    <Field type="text" name="password" style={!isError ? {
                        "borderRadius": "3px",
                        "borderWidth": "1px"
                    }: {
                        "borderRadius": "4px",
                        "borderWidth": "1px", "borderColor": "red"
                    }}></Field>
                    <br />
                    <hr>
                    </hr>
                    <button type="submit" >Login</button>
                </Form>

            </Formik>
            <br />
            <div>
                <span>OR</span>
                <br />
                <NavLink to="/registration">Create account</NavLink>
            </div>

            <section className="Sign_in_with_google">
                <br />
                <div >
                    <button type="button" onClick={sign_in_with_google} >Sign in with Google</button>
                    <img src={goole_pic} alt="#" style={{ "display": "inline-block", "width": "45px", "height": "40px", "verticalAlign": "middle" }} />
                </div>
            </section>
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