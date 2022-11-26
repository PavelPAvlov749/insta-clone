import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreateNewUserWithEmailAndPassword } from "../../Redux/RegistrationReducer";
import styles from "../../Styles/Registration.module.css"
import GaleryImg from "../../Media/imageGallery.png"
import { getUserRegFormFromState } from "../../Selectors/Selectors";
import { RegistrationActions } from "../../Redux/RegistrationReducer";
import { CreateNewUserType } from "../../Redux/Types";
import { Global_state_type } from "../../Redux/Store";




export const Registration: React.FC = React.memo((props) => {
    const dispatch: any = useDispatch()
    const navigate = useNavigate()
    const newAvatarIMG = useSelector((state: Global_state_type) => {
        return state.registration.avatar
    })
    const newUserRegForm = useSelector(getUserRegFormFromState)


    let [file, set_file] = useState(null);
    let [onError, setOnError] = useState({ onError: false, errorMessage: null as unknown as string })
    let [step, setStep] = useState(1)


    const setSubmit = (values: CreateNewUserType) => {
        if (values.email.length < 6 || values.userName.length < 6 || values.passwordField1.length < 6) {
            setOnError({ onError: true, errorMessage: "Fields should contain minimum 6 charecters" })
        } else if (values.passwordField1 !== values.passwordField2) {
            setOnError({ onError: true, errorMessage: "Password dint match" })
        } else {
            dispatch(CreateNewUserWithEmailAndPassword(values))
        }
    }
    const nexStepHandler = () => {
        setStep(2)
    }
    //Validation 
   
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
                dispatch(RegistrationActions.setAvatar(fileReader.result))

            }
        }
    }
    const statusOnChangeHandler = (e: any) => {
        dispatch(RegistrationActions.setStatus(e.currentTarget.value))
    }
    const isPasswordMatch = (e: any) => {

    }
    return (
        <section className={styles.container}>
            <h1>Registration</h1>
            <hr />

            {onError ? <span>{onError.errorMessage}</span> : null}
            <Formik

                
                enableReinitialize={true} //<= If true Form will reinitialize after reciving new initial value from state 

                //FORM INITIAL VALUES
                initialValues={{
                    avatar: newUserRegForm.avatar,
                    passwordField1: newUserRegForm.passwordField1,
                    passwordField2: newUserRegForm.passwordField2,
                    status: newUserRegForm.status,
                    userName: newUserRegForm.userName,
                    email: newUserRegForm.email
                }}

                onSubmit={setSubmit}>

                <Form className={styles.loginForms}>
                    {step === 1 ?
                        <div className={onError ? styles.loginFormsDIV : styles.loginFormsOnError}>

                            <Field type="text" name="username" placeholder={"Username"} autoComplete="off" onChange={(e: any) => {
                                dispatch(RegistrationActions.setUsername(e.currentTarget.value))
                            }}></Field>
                            <br />

                            <Field type="text" name="email" placeholder={"Email"} autoComplete="off" onChange={(e: any) => {
                                dispatch(RegistrationActions.setEmail(e.currentTarget.value))
                            }}></Field>
                            <br />

                            <Field type="text" name="passTake1" placeholder={"Password"} autoComplete="off" onChange={(e: any) => {
                                dispatch(RegistrationActions.setPasswordField1(e.currentTarget.value))
                            }}></Field>
                            <br />

                            <Field type="text" name="passTake2" placeholder={"Repeat the password"} autoComplete="off" onChange={(e: any) => {
                                if (e.currentTarget.value !== newUserRegForm.passwordField1) {
                                    console.log("Pass dint match")
                                }
                                dispatch(RegistrationActions.setPasswordField2(e.currentTarget.value))
                            }}></Field>
                            <br />
                            <button className={styles.registrationButton} onClick={nexStepHandler} type="button">Next Step</button>
                        </div> :
                        <section className={styles.registrationStep2}>
                            <label htmlFor="AvatarSelector">
                                <div className={styles.avatarPicker}>
                                    <label htmlFor="file_input">
                                        {newUserRegForm.avatar ? <img className={styles.registrationAvatar} src={newAvatarIMG} alt="#"></img> : <img className={styles.regAvatarIcon} src={GaleryImg} alt={"#"}></img>}
                                    </label>

                                </div>
                            </label>
                            <input className={styles.login_forms} type="file" id="file_input" style={{ "display": "none" }}
                                placeholder={"avatar"} accept="image/*" onChange={inputOnChangeHandler} ></input>
                            <Field type="text" name="status" placeholder="Set your status" onInput={statusOnChangeHandler} autoComplete="off" className={styles.regUserStatus}></Field>
                            <button type="submit" className={styles.registrationButton} >Create Acount</button>
                        </section>
                    }

                </Form>
            </Formik>

        </section>
    )


})

