import React, { useEffect,  } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  getAllPosts } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";

import styles from "../../Styles/News.module.css"

import { SinglePost } from "../Posts/OpenedPost";



export const AllPosts: React.FC = React.memo((props) => {
    const dispatch: any = useDispatch()
    useEffect(() => {
        dispatch(getAllPosts())
    }, [])

    const posts = useSelector((state: Global_state_type) => {
        return state.userPosts.posts
    })
    const currentUserID = useSelector((state: Global_state_type) => {
        return state.account.userID
    })


        return (
            <div className={styles.news}>

                {posts.length ? posts.map((post) => {
                    return (
                        <div className={styles.singlePostWrapper}>
                           <SinglePost post={post} currentUserID={currentUserID as string}/>
                        </div >
                    )

                }) : null}
            </div>
        )
   

})