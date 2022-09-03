import React, { MouseEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getPostListByUserID, postActions } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import { PostType } from "../../Redux/Types";
import { NewPostModalWindow } from "./NewPostModal";



export const UserPostsList : React.FC = React.memo((props) => {
    const navigate = useNavigate()
    const dispatch : any = useDispatch()
    const userPageID = useLocation().pathname.split("=")[1]


    useEffect(()=>{
        dispatch(getPostListByUserID(userPageID))
    },[userPageID])
    const posts : Array<PostType> = useSelector((state:Global_state_type) => {
        return state.userPosts.posts
    })


    const makePostActive = (postData : PostType) => {
        dispatch(postActions.set_showed_post(postData))
        navigate("/p/id="+ postData.id)
    }
    return (
        <div>
           
            <section style={{"position" : "relative", "zIndex" : "0",}}>
           
            {posts.length > 0 ? posts.map((post : PostType) => {
                return (
                    <div key={post.id}>
                        <img src={post.post_img} alt="" style={{"width" : "100px","height" : "100px","zIndex" : "1"}} onClick={() => {
                            makePostActive(post)
                        }}/>
                    </div>
                )
            }) : null}
        </section>
        </div>

    )
})