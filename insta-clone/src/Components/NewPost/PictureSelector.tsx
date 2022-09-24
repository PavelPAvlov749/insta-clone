import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";
import styles from "../../Styles/NewPostModal.module.css"
import GaleryImg from "../../Media/imageGallery.png"
import { app_actions } from "../../Redux/AppReducer";
import { postActions } from "../../Redux/PostReducer";


export const SelectPhoto : React.FC = React.memo ((props) => {

    const dispatch : any = useDispatch()
    const newPostIMG = useSelector((state: Global_state_type) => {
        return state.userPosts.newPostPhoto
    })
    let [file, set_file] = useState(null)
    const onClickHandler = (event : any) => {
        let target = event.target
        let fileReader = new FileReader()

        set_file(event.target.files[0])

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
    return (
        <section>
          <label htmlFor="file_input">
            {newPostIMG ? <img src={newPostIMG} className={styles.PicIcon} alt="#" ></img> : <img className={styles.newPostIMG} src={ GaleryImg} alt="#" ></img> }
            </label>
            <input type="file" id="file_input" style={{ "display": "none" }} accept="image/*" onChange={onClickHandler} ></input>
        </section>
    )
})