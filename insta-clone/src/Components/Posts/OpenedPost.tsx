//REACT,REACT_REDUX,HOOKS IMPORTS
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";

import { deletePostThunk, getSinglePostByID, likeToogleThunk, postActions } from "../../Redux/PostReducer";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
//COMPONENTS
import { SilngleComent } from "./Coments";

//STYLES IMPORT
import styles from "../../Styles/OpenPost.module.css"
//MEDIA IMPORTS
import likeImg from "../../Media/heart_icon.png"
import dislikeIMG from "../../Media/heart_icon_filled.png"
import { Avatar } from "../UserPage/Avatar";
import crossIcon from "../../Media/delete_icon.png"
import comentIcon from "../../Media/comentIcon.png"
import { Preloader } from "../Preloader/Preloader";
import { PostType } from "../../Redux/Types";


export const SinglePost : React.FC<{post:PostType,currentUserID : string}> = React.memo((props) => {
    const navigate = useNavigate()
    const dispatch: any = useDispatch()

    let location = useLocation().pathname.split("=")[1]
    useEffect(() => {
        dispatch(getSinglePostByID(location))
    }, [])


    const tapLikeHandler = () => {
        if (props.post.likes_count?.includes(props.currentUserID as string)) {
            dispatch(likeToogleThunk(props.post.id as string, props.currentUserID as string))
            dispatch(postActions.dislike(props.currentUserID as string))
        } else {
            dispatch(likeToogleThunk(props.post.id as string, props.currentUserID as string))
            dispatch(postActions.likeToogle(props.currentUserID as string))

        }

    }
    const onComentClickHandler = () => {
        navigate("coments")
    }
    const deletePostHandler = () => {
        dispatch(deletePostThunk(props.currentUserID as string,props.post.id as string))
        navigate(`/profile/id=${props.currentUserID}`)
    }
    if(props.post){
        return (
            <section className={styles.postWrapper}>
                <NavLink to={`/profile/id:=${props.post.creatorID}`} className={styles.creatorInfo}>
                    <Avatar avatarIMG={props.post.creatorAvatar} fullName={props.post.creator} size="small" />
    
                    <h1 className={styles.autorName}>{props.post?.creator}</h1>
                
                </NavLink>
                <div className={styles.postIMGContainer}>
                    <img className={styles.postIMG} src={props.post.post_img} alt="" />
                    <img src={ likeImg} alt="#" className={styles.likeIcon} onClick={tapLikeHandler} />
                    <img src={comentIcon} alt="#" className={styles.comentIcon} onClick={onComentClickHandler}></img>
                   
                    <span className={styles.likesCount} onClick={onComentClickHandler}>{  + "\t likes"}</span>
                    {props.currentUserID === props.post.creatorID ?  <img src={crossIcon} alt="#" className={styles.deletePost} onClick={deletePostHandler}></img> : null }
                </div>
    
                <div className={styles.postInfo}>
                    <h4>{props.post.creator + "\t:\t"}</h4>
                    <span>{props.post?.post_text}</span>
                </div>
                <h2 onClick={onComentClickHandler} className={styles.showAll}>Show all Coments</h2>
            </section>
        )
    }else{
        return (
            <>
            <Preloader/>
            </>
        )
    }

})

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
    const deletePostHandler = () => {
        dispatch(deletePostThunk(currentUserID as string,actualPost.id as string))
        navigate(`/profile/id=${currentUserID}`)
    }
    if (actualPost) {
        return (
            <section className={styles.postWrapper}>
                <NavLink to={`/profile/id:=${actualPost.creatorID}`} className={styles.creatorInfo}>
                    <Avatar avatarIMG={actualUserPage.avatar} fullName={actualUserPage.fullName} size="small" />

                    <h1 className={styles.autorName}>{actualPost?.creator}</h1>
                
                </NavLink>
                <div className={styles.postIMGContainer}>
                    <img className={styles.postIMG} src={actualPost.post_img} alt="" />
                    <img src={actualPost.likes_count.includes(currentUserID as string) ? dislikeIMG : likeImg} alt="#" className={styles.likeIcon} onClick={tapLikeHandler} />
                    <img src={comentIcon} alt="#" className={styles.comentIcon} onClick={onComentClickHandler}></img>
                   
                    <span className={styles.likesCount} onClick={onComentClickHandler}>{actualPost.likes_count?.length + "\t likes"}</span>
                    {currentUserID === actualPost.creatorID ?  <img src={crossIcon} alt="#" className={styles.deletePost} onClick={deletePostHandler}></img> : null }
                </div>

                <div className={styles.postInfo}>
                    <h4>{actualPost.creator + "\t:\t"}</h4>
                    <span>{actualPost?.post_text}</span>
                </div>
                {actualPost.coments.length > 0 ? <SilngleComent coment={actualPost?.coments[actualPost.coments.length - 1]} currentUserID={currentUserID as string}/> : 
                "There is no coments"}
                <h2 onClick={onComentClickHandler} className={styles.showAll}>Show all Coments</h2>
            </section>
        )
    } else {
        return (
            <>
                <Preloader/>
            </>

        )
    }

})