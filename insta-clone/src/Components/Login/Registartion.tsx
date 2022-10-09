import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUserByEmailAndPassword } from "../../Redux/AuthReducer";
import styles from "../../Styles/Registration.module.css"
import { postActions } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import GaleryImg from "../../Media/imageGallery.png"
import { AccountActions, updateAvatarThunk, updateStatusThunk } from "../../Redux/ProfileReducer";

export const Registration: React.FC = React.memo((props) => {
    const dispatch: any = useDispatch()
    const navigate = useNavigate()
    let [file, set_file] = useState(null);
    let [onError, setOnError] = useState({ onError: false, errorMessage: null as unknown as string })
    let [step, setStep] = useState(1)
    let avatar = useSelector((state: Global_state_type) => {
        return state.account.avatar
    })
    const currentUserID = useSelector((state:Global_state_type) => {
        return state.auth.user_id
    })
    let status = ""
    const setSubmit = (values: { username: string, email: string, password_1: string, password_2: string,avatar : any,status : string }) => {
        if (values.email.length < 6 || values.username.length < 6 || values.password_1.length < 6) {
            setOnError({ onError: true, errorMessage: "Fields should contain minimum 6 charecters" })
        } else if (values.password_1 !== values.password_2) {
            setOnError({ onError: true, errorMessage: "Password dint match" })
        } else {
            dispatch(createUserByEmailAndPassword(values.email, values.password_1, values.username))
            dispatch(updateAvatarThunk(values.avatar,currentUserID as string))
            dispatch(updateStatusThunk(currentUserID,values.status))
        }
    }
    const nexStepHandler = () => {
        setStep(2)
    }
    const onStatusChangeHanler = (e: any) => {

    }
    //FILE INPUT HANDLER FUNCTION
    const inputOnChangeHandler = (event: any) => {
        let target = event.target
        let fileReader = new FileReader()

        set_file(event.target.files[0]);

        if (!target.files.length) {
            //If file was uploaded with error log the error
            console.log("ERROR")
        } else {

            fileReader.readAsDataURL(target.files[0])
            fileReader.onload = function (e: ProgressEvent<FileReader>) {
                //Dispatch fileRader result in postReducer
                dispatch(AccountActions.updateAvatar(fileReader.result))
            }
        }
    }

    return (
        <section className={styles.container}>
            <h1>Registration</h1>
            <hr />

            {onError ? <span>{onError.errorMessage}</span> : null}
            <Formik
                enableReinitialize={true} //<= If true Form will reinitialize after reciving new initial value from state 
                className="login_forms"
                initialValues={{ username: "", email: "", password_1: "", password_2: "" ,status : "",avatar : null}} onSubmit={setSubmit}>

                <Form className={styles.loginForms}>
                    {step === 1 ?
                        <div className={onError ? styles.loginFormsDIV : styles.loginFormsOnEror}>

                            <Field type="text" name="username" placeholder={"Username"}></Field>
                            <br />

                            <Field type="text" name="email" placeholder={"Email"}></Field>
                            <br />

                            <Field type="text" name="password_1" placeholder={"Password"}></Field>
                            <br />

                            <Field type="text" name="password_2" placeholder={"Repeat the password"}></Field>
                            <br />
                            
                            <button className={styles.registrationButton} onClick={nexStepHandler} type="button">Next Step</button>
                        </div> :
                        <section className={styles.registrationStep2}>
                            <label htmlFor="AvatarSelector">
                                <div className={styles.avatarPicker}>
                                {avatar ? <img className={styles.registrationAvatar} src={avatar} alt="#"></img> : <img className={styles.regAvatarIcon} src={GaleryImg} alt={"#"}></img>}
                                </div>
                            </label>

                            <Field style={{ "display": "none" }} name="avatar" type={"file"} placeholder={"Select avatar"}
                            accept="image/*" id="AvatarSelector" onChange={inputOnChangeHandler}></Field>
                            <Field type="text" name="status" placeholder="Set your status"  className={styles.regUserStatus}></Field>
                            <button type="submit" className={styles.registrationButton} >Create Acount</button>
                        </section>

                    }

                   

                </Form>
            </Formik>

        </section>
    )


})