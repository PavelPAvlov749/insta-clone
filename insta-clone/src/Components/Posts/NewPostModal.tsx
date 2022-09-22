import { Field, Form, Formik } from "formik";
import React, { FormEventHandler, SyntheticEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPostThunk, postActions } from "../../Redux/PostReducer";
//IMPORTING STYLES
import styles from "../../Styles/NewPostModal.module.css"
import GaleryImg from "../../Media/imageGallery.png"
import { Global_state_type } from "../../Redux/Store";
import { ComentType, PostType } from "../../Redux/Types";
import { postAPI } from "../../DAL/PostApi";
import { app_actions } from "../../Redux/AppReducer";
import { useNavigate } from "react-router-dom";

type PostFormType = {
    post_text: string,
    post_img: string,
    post_tag: string,
    file: any
};


export const NewPostModalWindow: React.FC = React.memo((props) => {
    const dispatch: any = useDispatch()
    const navigation = useNavigate()
    let isOnLoad = useSelector((state:Global_state_type) => {
        return state.app.onLoad
    })
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
            fileReader.onload = function (e:ProgressEvent<FileReader>) {
                //Dispatch fileRader result in postReducer
                dispatch(app_actions.setOnLoad(true))
                dispatch(postActions.setNewPostPhoto(fileReader.result))
                dispatch(app_actions.setOnLoad(false))

            }
        }
    }
    //Handler for modal window closing button
    const onCloseHandler = () => {
        dispatch(postActions.setIsOnnewPost(false))
        dispatch(postActions.setNewPostPhoto(null))
    }
    //TEXT INPUT onCHAHGE HANDLER FUNCTION WILL DISPATCH IN STORE NEW VALUE OF NEW POST TEXT FIELD
    const textFieldOnChangeHandler = (e:any) => {
        console.log(e.key)
        dispatch(postActions.setNewPosttext(e.key))
    }
    //SUNBIMT HANDLER 
    const formSubmit = (values: PostFormType) => {
        //  dispatch(postActions.setNewPosttext(values.post_text))
        const newPost: PostType = {
            post_img: newPostIMG,
            post_text: newPostText,
            creator: currendUser.fullName as string,
            likes_count: [] as Array<string>,
            coments: [] as Array<ComentType>,
            creatorID : currendUser.userID  as string,
            creatorAvatar : currendUser.avatar as string
        }
        dispatch(createNewPostThunk(currendUser.userID as string, values.file, values.post_text,
             values.post_tag, currendUser.fullName as string,currendUser.avatar,currendUser.userID as string))
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
                
            <Form >
                <input type="file" id="file_input" style={{ "display": "none" }} accept="image/*" onChange={inputOnChangeHandler} ></input>
                <h4>Type text to your post : </h4>
                <Field type="text" name="post_text" className={styles.textInput} onKeyUp={textFieldOnChangeHandler}></Field>
                <h4>Thype tags : </h4>
                <Field type="text" name="post_tag" className={styles.textInput}/>
                <br />
                <button type="submit" className={styles.publish} disabled={isOnLoad}>Publish</button>
            </Form>
        </Formik>
           
        </section >
    )
})