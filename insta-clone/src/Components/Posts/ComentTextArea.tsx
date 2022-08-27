import { Field, Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";


export const ComentTextArea : React.FC = React.memo((props) => {
    const dispatch = useDispatch()

    const newPostText = useSelector((state: Global_state_type) => {
        return state.userPosts
    })

    
    const setSubmit = () => {

    }
    const onFormErrorHandler = () => {

    }
    const onChangeHandler = (event : any) => {
        
    }
    return (
        <section className="ComentInputContainer">
            <h3>Leave the coment : </h3>
            <div contentEditable={true} onChange={onChangeHandler} style={{"width" : "500px","height" : "200px","backgroundColor" : "lightgrey"}}>
            </div>
            <button type="button" onClick={setSubmit}>Publish</button>
        </section>
    )
})