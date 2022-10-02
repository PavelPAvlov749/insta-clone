//REACT,REACT_REDUX,HOOKS IMPORTS
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";
import comentIcon from "../../Media/coment.png"
import { getSinglePostByID, likeToogleThunk, postActions } from "../../Redux/PostReducer";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
//COMPONENTS
import { PostComents } from "./Coments";
import { ComentTextArea } from "./ComentTextArea";
//STYLES IMPORT
import styles from "../../Styles/OpenPost.module.css"
//MEDIA IMPORTS
import likeImg from "../../Media/like.png"
import likeBefore from "../../Media/likeBefore.png"
import likeAfter from "../../Media/likeAfter.png"
import { Avatar } from "../UserPage/Avatar";


export const ShowedPost: React.FC = React.memo((props) => {
    const navigate = useNavigate()
    const dispatch: any = useDispatch()
    const currentUserID = useSelector((state: Global_state_type) => {
        return state.account.userID
    })
    let location = useLocation().pathname.split("=")[1]
    useEffect(() => {
        dispatch(getSinglePostByID(location))
    }, [])
    const actualUserPage = useSelector((state: Global_state_type) => {
        return state.userPage
    })
    const actualPost = useSelector((state: Global_state_type) => {
        return state.userPosts.currentPost
    })
    console.log(actualPost.post_img)

    const tapLikeHandler = () => {
        if (actualPost.likes_count?.includes(currentUserID as string)) {
            dispatch(likeToogleThunk(actualPost.id as string, currentUserID as string))
            dispatch(postActions.dislike(currentUserID as string))
        } else {
            dispatch(likeToogleThunk(actualPost.id as string, currentUserID as string))
            dispatch(postActions.likeToogle(currentUserID as string))

        }

    }
    const onComentClickHandler = () => {
        navigate("coments")
    }
    if (actualPost) {
        return (
            <section className={styles.postWrapper}>
                <NavLink to={`/profile/id:=${actualPost.creatorID}`} className={styles.creatorInfo}>
                    <Avatar avatarIMG={actualUserPage.avatar} fullName={actualUserPage.fullName} size="small" />

                    <h1 className={styles.autorName}>{actualPost?.creator}</h1>
                    <div className={styles.hr}></div>
                </NavLink>
                <div className={styles.postIMGContainer}>
                    <img className={styles.postIMG} src={actualPost.post_img} alt="" />
                    <img src={actualPost.likes_count.includes(currentUserID as string) ? likeAfter : likeBefore} alt="#" className={styles.likeIcon} onClick={tapLikeHandler} />
                    <img src={comentIcon} alt="#" className={styles.comentIcon} onClick={onComentClickHandler}></img>
                    <span className={styles.likesCount} onClick={onComentClickHandler}>{actualPost.likes_count?.length + "\t likes"}</span>
                </div>

                <div className={styles.postInfo}>
                    <h5>{actualPost.creator + "\t:\t"}</h5>
                    <span>{actualPost?.post_text}</span>
                </div>
                <PostComents coments={actualPost.coments} />

            </section>
        )
    } else {
        return (
            <>
                <h1>Now Feth ...</h1>
            </>

        )
    }

})