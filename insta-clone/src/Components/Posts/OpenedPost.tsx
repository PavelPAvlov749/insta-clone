import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";
import { PostComents } from "./Coments";
import likeImg from "../../Media/like.png"
import { getSinglePostByID, likeToogleThunk, postActions } from "../../Redux/PostReducer";
import { ComentTextArea } from "./ComentTextArea";
import { NavLink, useLocation } from "react-router-dom";
import styles from "../../Styles/OpenPost.module.css"

export const ShowedPost: React.FC = React.memo((props) => {
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


    const tapLikeHandler = () => {
        if (actualPost.likes_count?.includes(currentUserID as string)) {
            dispatch(likeToogleThunk(actualPost.id as string, currentUserID as string))
            dispatch(postActions.dislike(currentUserID as string))
        } else {
            dispatch(likeToogleThunk(actualPost.id as string, currentUserID as string))
            dispatch(postActions.likeToogle(currentUserID as string))

        }

    }

    if (actualPost) {
        return (
            <section className={styles.postWrapper}>
                                        <NavLink to={`/profile/id:=${actualPost.creatorID}`} className={styles.creatorInfo}>
                    <img className={styles.autorAvatar} src={actualPost.creatorAvatar as string} alt="#" style={{ "display": "inline" }}></img>
                    <h1 className={styles.autorName}>{actualPost?.creator}</h1>
                    <div className={styles.hr}></div>
                </NavLink>
                    <div className={styles.postIMGContainer}>
                    <img className={styles.postIMG} src={actualPost?.post_img ? actualPost?.post_img : "#"} alt="" />
                        <img src={likeImg} alt="#" className={styles.likeIcon} onClick={tapLikeHandler} />
                        <span>{actualPost.likes_count?.length + "\t likes"}</span>
                    </div>           

                <div className={styles.postInfo}>
                    <h5>{actualPost.creator + "\t:\t"}</h5>
                    <span>{actualPost?.post_text}</span>
                </div>
                <PostComents coments={actualPost.coments} />
                <ComentTextArea />
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