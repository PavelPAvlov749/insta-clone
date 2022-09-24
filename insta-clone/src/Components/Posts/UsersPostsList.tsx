import React, { MouseEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getPostListByUserID, postActions } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import { PostType } from "../../Redux/Types";
import { NewPostModalWindow } from "./NewPostModal";
import styles from "../../Styles/Posts.module.css"


export const UserPostsList: React.FC = React.memo((props) => {
    const navigate = useNavigate()
    const dispatch: any = useDispatch()
    const userPageID = useLocation().pathname.split("=")[1]

    const postIMG = useSelector((state:Global_state_type) =>{
        return 
    })
    useEffect(() => {
        dispatch(getPostListByUserID(userPageID))
    }, [userPageID])

    const posts: Array<PostType> = useSelector((state: Global_state_type) => {
        return state.userPosts.posts
    })


    const navigateToPost = (postData: PostType) => {
        navigate("/p/id=" + postData.id)
        dispatch(postActions.set_showed_post(postData))

    }
    
    return (
        <div className={styles.wrapper}>
            <section className={styles.postsWrapper}>
                {posts.length > 0 ? posts.map((post: PostType) => {
                      {console.log(typeof(post.post_img))}
                    return (
                      
                            <img src={post.post_img} className={styles.postPreview} alt="" onClick={() => {
                                navigateToPost(post)
                            }} />
                
                    )
                }) : null}
            </section>
        </div>

    )
})