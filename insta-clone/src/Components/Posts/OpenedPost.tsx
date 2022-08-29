import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";
import { PostComents } from "./Coments";
import likeImg from "../../Media/like.png"
import { getSinglePostByID, postActions } from "../../Redux/PostReducer";
import { ComentTextArea } from "./ComentTextArea";
import { NavLink, useLocation } from "react-router-dom";


export const ShowedPost : React.FC = React.memo((props) => {
    const dispatch : any = useDispatch()
    const currentUserID = useSelector((state : Global_state_type) => {
        return state.account.userID
    })
    const actualUserPage = useSelector((state : Global_state_type) => {
        return state.userPage
    })

    const actualPost = useSelector((state:Global_state_type) => {
        return state.userPosts
    })

    const likesCount = useSelector((state : Global_state_type) => {
        return state.userPosts.currentPost.likes_count
    })

    const tapLikeHandler = () => {
        if(likesCount.includes(currentUserID as string)){
            dispatch(postActions.dislike(currentUserID as string))
            console.log("DISPATCH")
        }else{
            dispatch(postActions.likeToogle(currentUserID as string))
            console.log("DISPATCH")
        }

    }
    return (
        <section>
            <NavLink to={`/profile/id:=${actualUserPage.userID}`}>
            <img src={actualUserPage.avatar as string} alt="#" style={{"display" : "inline"}}></img>
            <h1 style={{"display" : "inline"}}>{actualPost.currentPost.creator}</h1>
            </NavLink>
            <br />
        
            <img src={actualPost.currentPost.post_img} alt="" style={{"width" : "400px","height" : "400px"}}/>
            <span>{likesCount.length + "\t likes"}</span>
            <img src={likeImg} alt="#" style={{"width" : "40px","height" : "40px"}} onClick={tapLikeHandler} />
            <PostComents/>
            <ComentTextArea/>
        </section>
    )
})