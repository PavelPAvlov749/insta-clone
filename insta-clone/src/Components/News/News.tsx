import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import { ShowedPost } from "../Posts/OpenedPost";

export const AllPosts : React.FC = React.memo((props) => {
    const dispatch : any = useDispatch()
    const posts = useSelector((state:Global_state_type) => {
        return state.userPosts.posts
    })
    useEffect(()=> {
        dispatch(getAllPosts())
    },[])
    console.log(posts)
    return (
        <>
        <h1>News</h1>
                    {posts.length > 0 ? posts.map((post) => {
                <ShowedPost/>
            }) : null}
        </>
    )
})