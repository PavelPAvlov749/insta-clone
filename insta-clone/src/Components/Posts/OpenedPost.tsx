import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";
import { PostComent } from "./Coments";
import likeImg from "../../Media/like.png"
import { postActions } from "../../Redux/PostReducer";
import { ComentTextArea } from "./ComentTextArea";


export const ShowedPost : React.FC = React.memo((props) => {
    const dispatch = useDispatch()

    const actualPost = useSelector((state:Global_state_type) => {
        return state.userPosts
    })

    const likesCount = useSelector((state : Global_state_type) => {
        return state.userPosts.currentPost.likes_count
    })
    const currentUserID = useSelector((state : Global_state_type) => {
        return state.account.userID
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
            <h1>ACTUAL POST</h1>
            <img src={actualPost.currentPost.post_img} alt="" style={{"width" : "400px","height" : "400px"}}/>
            <span>{likesCount.length + "\t likes"}</span>
            <img src={likeImg} alt="#" style={{"width" : "40px","height" : "40px"}} onClick={tapLikeHandler} />
            <PostComent/>
            <ComentTextArea/>
        </section>
    )
})