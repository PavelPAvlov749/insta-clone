import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPostThunk, postActions } from "../../Redux/PostReducer";
//IMPORTING STYLES
import styles from "../../Styles/NewPostModal.module.css"
import GaleryImg from "../../Media/imageGallery.png"
import { Global_state_type } from "../../Redux/Store";
import { ComentType, PostType } from "../../Redux/Types";
import { postAPI } from "../../DAL/PostApi";

type PostFormType = {
    post_text: string,
    post_img: string,
    post_tag: string,
    file: any
};


export const NewPostModalWindow: React.FC = React.memo((props) => {
    const dispatch: any = useDispatch()
    //NEW POST SELECTORS
    const newPostIMG = useSelector((state: Global_state_type) => {
        return state.userPosts.newPostPhoto
    })
    const newPostText = useSelector((state: Global_state_type) => {
        return state.userPosts.newPostText
    })
    const currendUser = useSelector((state: Global_state_type) => {
        return state.account
    })

    //INITIAL VALUES FOR NEW POST FORM
    let new_post_text = "";
    let new_post_img = "";
    let new_post_tag = "";
    let [file, set_file] = useState(null);

    //File upload handler.Conferts Blob file type to string with fileReader
    const inputOnChangeHandler = (event: any) => {
        let target = event.target
        let fileReader = new FileReader()

        set_file(event.target.files[0]);

        if (!target.files.length) {
            //If file was uploaded with error log the error
            console.log("ERROR")
        } else {
           
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
    //SUNBIMT HANDLER 
    const formSubmit = (values: PostFormType) => {
        dispatch(postActions.setNewPosttext(values.file))
        const newPost: PostType = {
            post_img: newPostIMG,
            post_text: newPostText,
            creator: currendUser.fullName as string,
            likes_count: [] as Array<string>,
            coments: [] as Array<ComentType>,
        }
        console.log(values.post_img)
        postAPI.createPost(currendUser.userID as string, values.file, values.post_text, values.post_tag, currendUser.fullName as string)
        //dispatch(createNewPostThunk(currendUser.userID as string, values.file, values.post_text, values.post_tag, currendUser.fullName as string))
        dispatch(postActions.setIsOnnewPost(false))
    }
    return (
        <section className={styles.newPostModal}>

            <h1 style={{ "display": "inline" }}>Creating a publication</h1>
            <span onClick={onCloseHandler}>Close</span>
            <hr />
            <label htmlFor="file_input">
                <img src={newPostIMG ? newPostIMG : GaleryImg} alt="#" ></img>
            </label>
            <Formik enableReinitialize={true}
                initialValues=
                {{post_text: new_post_text,
                post_img: new_post_img,
                post_tag: new_post_tag,
                file: file}}
                onSubmit={formSubmit}>
            <Form>
                <input type="file" id="file_input" style={{ "display": "none" }} accept="image/*" onChange={inputOnChangeHandler}></input>
                <h4>Type text to your post : </h4>
                <Field type="text" name="post_text"></Field>
                <h4>Thype tags : </h4>
                <Field type="text" name="post_tag" />
                <br />
                <button type="submit">Publish</button>
            </Form>
        </Formik>
           
        </section >
    )
})