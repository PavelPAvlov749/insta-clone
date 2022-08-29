import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postActions } from "../../Redux/PostReducer";
//IMPORTING STYLES
import styles from "../../Styles/NewPostModal.module.css"
import GaleryImg from "../../Media/imageGallery.png"
import { Global_state_type } from "../../Redux/Store";
import { ComentType, PostType } from "../../Redux/Types";



export const NewPostModalWindow: React.FC = React.memo((props) => {
    const dispatch = useDispatch()
    //NEW POST SELECTORS
    const newPostIMG = useSelector((state : Global_state_type) => {
        return state.userPosts.newPostPhoto
    })
    const newPostText = useSelector((state: Global_state_type) => {
        return state.userPosts.newPostText
    })
    const currendUser = useSelector((state:Global_state_type) => {
        return state.account.fullName
    })
    //INITIAL VALUES FOR NEW POST FORM
    let initialFormValues = {
        newPostText : "",
        newPostImg : ""
    }

    //File upload handler.Conferts Blob file type to string with fileReader
    const inputOnChangeHandler = (event : any) => {
        let target = event.target
        let fileReader = new FileReader()
        if(!target.files.length){
            //If file was uploaded with error log the error
            console.log("ERROR")
        }else{
            fileReader.readAsDataURL(target.files[0])
            fileReader.onload = function () {
                //Dispatch fileRader result in postReducer
                dispatch(postActions.setNewPostPhoto(fileReader.result))
                
            }
        }
    }
    //Handler for modal window closing button
    const onCloseHandler = () => {
        dispatch(postActions.setIsOnnewPost(false))
        dispatch(postActions.setNewPostPhoto(null))
    }
    const formSubmit = (values : typeof initialFormValues) => {
        dispatch(postActions.setNewPosttext(values.newPostText))
        const newPost : PostType = {
            post_img : newPostIMG,
            post_text : newPostText,
            creator : currendUser as string,
            likes_count : [] as Array<string>,
            coments : [] as Array<ComentType>
        }
        dispatch(postActions.createPost(newPost))
    }
    return (
        <section className={styles.newPostModal}>

            <h1 style={{"display" : "inline"}}>Creating a publication</h1>
            <span onClick={onCloseHandler}>Close</span>
            <hr />
            <label htmlFor="file_input">
            <img src={newPostIMG ? newPostIMG : GaleryImg} alt="#"></img>
            </label>
            <Formik enableReinitialize={true} initialValues={initialFormValues} onSubmit={formSubmit}>
                <Form>
                    <Field type="file" name="newPostImg" id="file_input" style={{"display" : "none"}} onChange={inputOnChangeHandler}></Field>
                    <Field type="text" name="newPostText"></Field>
                    <button type="submit">Publish</button>
                </Form>
            </Formik>
           
        </section >
    )
})