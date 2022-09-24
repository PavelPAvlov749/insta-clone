import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { app_actions } from "../../Redux/AppReducer";
import { AccountActions, updateAvatarThunk } from "../../Redux/ProfileReducer";
import { AvatarPropsType } from "../../Redux/Types";
import styles from "../../Styles/Avatar.module.css"



//the component takes into account the user name, the picture, and the size of the avatar 
//depends on the place where it is rendered (large for the user's page and small, for example, for user lists)
export const Avatar: React.FC<AvatarPropsType> = React.memo((props) => {
    console.log(props)
    const dispatch : any = useDispatch()

    const onAvatarCkickHandler = (event : any) => {
        let fileReader = new FileReader()
        if (!event.target.files.length) {
            console.log("ERROR")
        } else {
            fileReader.readAsDataURL(event.target.files[0])
            fileReader.onload = function () {
                dispatch(updateAvatarThunk(event.target.files[0], props.userID))
                dispatch(AccountActions.updateAvatar(fileReader.result?.toString()))
            }

        }
    }
    //IF THE USER HAS NOT FOUND THE AVATAR, THE AVATAR IS null IN THIS CASE, 
    //THE COMPONENT RENDERS THE AVATAR FROM THE FIRST LETTER OF prop.fullNAme SET IN UPPERCASE
    if (props.avatarIMG === null || props.avatarIMG === undefined) {
        let userName = props.fullName?.charAt(0).toUpperCase()
  
        return (
            //props.size sets the size of the avatar
            <div className={props.size === "large" ? styles.defaultAvatarLarge : styles.defaultAvatarSmall}>
                <label htmlFor="avatarInput">
                    <span>{userName}</span>
                </label>
                <input type="file" placeholder="Files" accept="image/*" onChange={onAvatarCkickHandler} 
                id="avatarInput" style={{ "display": "none" }}></input>
            </div>
        )
    } else {
        return (
            <div className={props.size === "large" ? styles.avatarLarge : styles.avatarSmall}>

                <label htmlFor="avatarInputImg">
                    <img src={props.avatarIMG} alt="#"></img>
                </label>
                <input type="file" placeholder="Files" accept="image/*" onChange={onAvatarCkickHandler}
                    id="avatarInputImg" style={{ "display": "none" }}></input>
            </div>
        )
    }
})