import React, { useState } from "react";
import { Formik, Field, Form, yupToFormErrors } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreateNewUserWithEmailAndPassword } from "../../Redux/RegistrationReducer";
import styles from "../../Styles/Registration.module.css"
import GaleryImg from "../../Media/imageGallery.png"
import { getUserRegFormFromState } from "../../Selectors/Selectors";
import { RegistrationActions } from "../../Redux/RegistrationReducer";
import { CreateNewUserType } from "../../Redux/Types";
import { Global_state_type } from "../../Redux/Store";
import * as yup from "yup"
import { dir } from "console";
import { confirmPasswordReset } from "firebase/auth";



export const Registration: React.FC = React.memo((props) => {

    let validationShema = yup.object().shape({
        userName: yup.string().typeError("Field must be string").required("This Field is Required").max(22).min(6),
        email: yup.string().typeError("Field must be string").required("This Field is Required").max(22).min(6),
        password: yup.string().typeError("Field must be string").required("This Field is Required").max(20).min(6),
        confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords dindt match").required("This Field is Reqired").min(6).max(20)
    })
    const newUser = useSelector((state: Global_state_type) => {
        return state.registration
    })
    const dispatch: any = useDispatch()

    const initialValues = {
        userName: newUser.userName,
        email: newUser.email,
        password: newUser.password,
        confirmPassword: newUser.confirmPassword
    }

    const handleSubmit = (values: any, errors: any) => {
        console.log(values)
        dispatch(CreateNewUserWithEmailAndPassword(values))
    }

    return (
        <section className={styles.container}>
            <h1>Registration</h1>
            <hr />
            <Formik initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationShema}
                onSubmit={handleSubmit}
                validateOnBlur={true}

            >
                {({ values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty }) => {
                    return (
                        <div>
                            <Form className={styles.formContainer}>
                                <section className={styles.loginForms}>
                                    <Field className={touched.userName && errors.userName ? styles.inputOnError : styles.regInput} name="userName" placeholder="username" onChange={handleChange}
                                        value={values.userName} onBlur={handleBlur} type="text"></Field>
                                    <br></br>
                                    <span className={styles.regError}>{touched.userName && errors.userName && errors.userName}</span>
                                    <Field className={touched.email && errors.email ? styles.inputOnError : styles.regInput} name="email" type="text" onChange={handleChange} value={values.email} onBlur={handleBlur} placeholder="email"></Field>
                                    <br></br>
                                    <span className={styles.regError}>{touched.email && errors.email && errors.email}</span>
                                    <input className={touched.password && errors.password ? styles.inputOnError : styles.regInput} title="password" placeholder="password" name="password" type="password" onChange={handleChange} value={values.password} onBlur={handleBlur}></input>
                                    <br></br>
                                    <span className={styles.regError}>{touched.password && errors.password && errors.password}</span>
                                    <input className={touched.confirmPassword && errors.confirmPassword ? styles.inputOnError : styles.regInput} title="password" placeholder="confirm password" name="confirmPassword" type="password" onChange={handleChange} value={values.confirmPassword} onBlur={handleBlur}></input>
                                    <br></br>
                                    <span className={styles.regError}>{touched.confirmPassword && errors.confirmPassword && errors.confirmPassword}</span>
                                </section>
                                <div className={styles.Regbutton}>
                                <button type="submit" disabled={!isValid && !dirty} onClick={handleBlur}>Create Account</button>
                                </div>
                           
                            </Form>
                        </div>
                    )
                }}
            </Formik>
        </section>
    )
})

