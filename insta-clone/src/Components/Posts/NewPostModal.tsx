import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postActions } from "../../Redux/PostReducer";
//IMPORTING STYLES
import styles from "../../Styles/NewPostModal.module.css"
import GaleryImg from "../../Media/imageGallery.png"
import { Global_state_type } from "../../Redux/Store";


export const NewPostModalWindow: React.FC = React.memo((props) => {
    const dispatch = useDispatch()
    const currentUserAvatar = useSelector((state:Global_state_type) => {
        return state.account.avatar
    })
    const newPostPhoto = useSelector((state: Global_state_type) => {
        return state.userPosts.newPostPhoto
    })
    const isOnNewPost = useSelector((state: Global_state_type) => {
        return state.userPosts.isOnNewPost
    })
    const photoOnLoad = (e: any) => {
        dispatch(postActions.setIsOnnewPost(true))
        dispatch(postActions.setNewPostPhoto(e.target.files[0]))
        console.log(e.target.files[0])
    }
    let imgURL = null

    const inputOnChangeHandler = (event : any) => {
        let target = event.target
        let fileReader = new FileReader()
        let img = document.getElementById("newPost")
        
        if(!target.files.length){
            console.log("ERROR")
        }else{
            fileReader.readAsDataURL(target.files[0])
            fileReader.onload = function () {
                imgURL = fileReader.result
                dispatch(postActions.setNewPostPhoto(imgURL))
                console.log(imgURL)
            }
            
        }
    }
    const onCloseHandler = () => {
        dispatch(postActions.setIsOnnewPost(false))
        dispatch(postActions.setNewPostPhoto(null))
    }
    return (
        <section className={styles.newPostModal}>

            <h1 style={{"display" : "inline"}}>Creating a publication</h1>
            <span onClick={onCloseHandler}>Close</span>
            <hr />
            {newPostPhoto === null ?
                <div className={styles.newPostImageWrapper}>
                    <h2>Select image</h2>
                    
                    <br />
                    <img src={GaleryImg} alt="" />
                    <label htmlFor="file_input">
                    <div className={styles.button}>
                        Load Files
                    </div>
                    </label>
                    <input type="file" placeholder="Put eout file" id="file_input" accept="image/*" style={{ "display": "none" }} onChange={inputOnChangeHandler}></input>
                </div> :
                <div className={styles.imgContainer}>
                    <div >
                        <label htmlFor="image_input">
                        <img src={newPostPhoto} alt="#" className={styles.newPostImg}></img>
                        </label>
                        <input type="file" placeholder="Put your files" id="image_input" style={{"display" : "none"}} onChange={inputOnChangeHandler}></input>
                    </div>
                    <section className={styles.textInputContainer}>
                        <div>

                            <div className={styles.textInput} contentEditable={true}>
                        Type post text
                    </div>
                        </div>
                    </section>

                </div>}

        </section >
    )
})