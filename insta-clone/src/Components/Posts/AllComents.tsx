import React from "react";
import { ComentType } from "../../Redux/Types";
import styles from "../../Styles/Coments.module.css"
import { SilngleComent } from "./Coments";
import { ComentTextArea } from "./ComentTextArea";
import backArrow from "../../Media/back.png"
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";
import { Avatar } from "../UserPage/Avatar";
import comentIcon from "../../Media/comentIcon.png"


export const AllComents : React.FC = React.memo((props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentUserID = useSelector((state:Global_state_type) => {
        return state.account.userID
    })
    const postComents = useSelector((state:Global_state_type) => {
        return state.userPosts.currentPost.coments
    })
    const backArrowCloickHandler = () => {
        const backPath = location.pathname.split("/coments")[0]
        navigate(backPath)
    }
    return (
        <section  className={styles.comentWrapper}>
            <img className={styles.backArrow} src={backArrow} onClick={backArrowCloickHandler} alt="#"></img>
            <span>Back to the post</span>
            <div className={styles.comentsList}>
            {postComents.length > 0 ? postComents.map((coment) => {
                return (

                    <>
                        <Avatar size="small" fullName={coment?.comentatorName as string} avatarIMG={coment.avatar}/>
                        <SilngleComent coment={coment} currentUserID={currentUserID as string}/>
                    </>
                )
            }) : <div>
                <img className={styles.comentIcon} src={comentIcon} alt="#">
                </img>
                <span className={styles.noComents}>There is no coments</span></div>}
            </div>
            <ComentTextArea/>
        </section>
    )
})