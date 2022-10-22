import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth_actions, createUserByEmailAndPassword } from "../../Redux/AuthReducer";
import styles from "../../Styles/Registration.module.css"
import { Global_state_type } from "../../Redux/Store";
import GaleryImg from "../../Media/imageGallery.png"
import { AccountActions, updateAvatarThunk, updateStatusThunk } from "../../Redux/ProfileReducer";
import {getUserRegFormFromState } from "../../Selectors/Selectors";



export const Registration: React.FC = React.memo((props) => {
    const dispatch: any = useDispatch()
    const navigate = useNavigate()

    const newUserRegForm = useSelector(getUserRegFormFromState)
    
    
    let [file, set_file] = useState(null);
    let [onError, setOnError] = useState({ onError: false, errorMessage: null as unknown as string })
    let [step, setStep] = useState(1)
    

    const setSubmit = (values: { username: string, email: string, passTake1: string, passTake2: string,avatar : string | null,status : string }) => {
        if (values.email.length < 6 || values.username.length < 6 || values.passTake1.length < 6) {
            setOnError({ onError: true, errorMessage: "Fields should contain minimum 6 charecters" })
        } else if (values.passTake1 !== values.passTake2) {
            setOnError({ onError: true, errorMessage: "Password dint match" })
        } else {
            dispatch(createUserByEmailAndPassword(values.email, values.passTake1, values.username,newUserRegForm.avatar,newUserRegForm.status as string))
            
          
        }
    }
    const nexStepHandler = () => {
        setStep(2)
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
                dispatch(AccountActions.setNewAvatar(fileReader.result))
                dispatch(AccountActions.updateAvatar(fileReader.result))
            }
        }
    }
    const statusOnChangeHandler = (e:any) => {
        dispatch(AccountActions.setNewStatus(e.currentTarget.value))
    }
    const isPasswordMatch = (e : any) => {

    }
    return (
        <section className={styles.container}>
            <h1>Registration</h1>
            <hr />

            {onError ? <span>{onError.errorMessage}</span> : null}
            <Formik
                enableReinitialize={true} //<= If true Form will reinitialize after reciving new initial value from state 
                className="login_forms"
                //FORM INITIAL VALUES
                initialValues={newUserRegForm} onSubmit={setSubmit}>
                    
                <Form className={styles.loginForms}>
                    {step === 1 ?
                        <div className={onError ? styles.loginFormsDIV : styles.loginFormsOnEror}>

                            <Field type="text" name="username" placeholder={"Username"} onChange={(e:any) => {
                                dispatch(auth_actions.setNewUserName(e.currentTarget.value))
                            }}></Field>
                            <br />

                            <Field type="text" name="email" placeholder={"Email"} onChange={(e:any) => {
                                dispatch(auth_actions.setNewUserEmail(e.currentTarget.value))
                            }}></Field>
                            <br />

                            <Field type="text" name="passTake1" placeholder={"Password"} onChange={(e : any) => {
                                dispatch(auth_actions.setNewUserPassword(e.currentTarget.value))
                            }}></Field>
                            <br />

                            <Field type="text" name="passTake2" placeholder={"Repeat the password"} onChange={(e:any) => {
                                if(e.currentTarget.value !== newUserRegForm.passTake1){
                                    console.log("Pass dint match")
                                }
                                dispatch(auth_actions.setNewUserPassword2(e.currentTarget.value))
                            }}></Field>
                            <br />
                            <button className={styles.registrationButton} onClick={nexStepHandler} type="button">Next Step</button>
                        </div> :
                        <section className={styles.registrationStep2}>
                            <label htmlFor="AvatarSelector">
                                <div className={styles.avatarPicker}>
                                {newUserRegForm.avatar ? <img className={styles.registrationAvatar} src={newUserRegForm.avatar} alt="#"></img> : <img className={styles.regAvatarIcon} src={GaleryImg} alt={"#"}></img>}
                                </div>
                            </label>

                            <Field style={{ "display": "none" }} name="avatar" type={"file"} placeholder={"Select avatar"}
                            accept="image/*" id="AvatarSelector" onChange={inputOnChangeHandler}></Field>
                            <Field type="text" name="status" placeholder="Set your status" onInput={statusOnChangeHandler} className={styles.regUserStatus}></Field>
                            <button type="submit" className={styles.registrationButton} >Create Acount</button>
                        </section>

                    }

                </Form>
            </Formik>

        </section>
    )


})