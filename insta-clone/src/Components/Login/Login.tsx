import React, { Dispatch } from "react";
import { Formik, Field, Form } from "formik";
import { Global_state_type } from "../../Redux/Store";
import {connect, useDispatch} from "react-redux";
import {Navigate, NavLink} from "react-router-dom";
import goole_pic from "../../Media/google_button.png";




export const Login: React.FC = React.memo((props) => {
    let dispatch :any = useDispatch();
    let login = "";
    let password = "";
    const set_submit = (values: any,) => {
        login = values.login;
        password = values.password;
        
    

    }
    const sign_in_with_google = ()=>{
        //@ts-ignore
        props.sign_in();
    }
    
        return (
            <div >
                <h1>Login</h1>
                <Formik
                    enableReinitialize={true} //<= If true Form will reinitialize after reciving new initial value from state 
                    className="login_forms"
                    initialValues={{ login: login, password: password }} onSubmit={set_submit}>
                    <Form >
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
                    <img src={goole_pic} alt="#" style={{"display" : "inline-block","width": "45px" ,"height" : "40px","verticalAlign" : "middle"} } />
                   </div>
                </section>
            </div>
    
        )
    

})

const MapStateToProps = (state:Global_state_type) => {
    return {
        is_auth : state.auth.is_auth,
        auth_token : state.auth.auth_token
    }
};
const MapDispatchToProps = (dispatch : any) => {
    return {

    }
}
export const Login_container = connect(MapStateToProps,MapDispatchToProps)(Login);