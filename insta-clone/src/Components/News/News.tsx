import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import { ShowedPost } from "../Posts/OpenedPost";
import { Preloader } from "../Preloader/Preloader";
import styles from "../../Styles/News.module.css"

export const AllPosts: React.FC = React.memo((props) => {
    const dispatch: any = useDispatch()
    const posts = useSelector((state: Global_state_type) => {
        return state.userPosts.posts
    })
    useEffect(() => {
        dispatch(getAllPosts())
    }, [])
    console.log(posts)
    const ScrollToTop = function () {

    }
    if (posts) {
        return (
            <section className={styles.news}>

                <button type="button" onClick={ScrollToTop}>Top</button>

                {posts.length ? posts.map((post) => {
                    return (
                        <>
                            <img src={post.post_img} alt="#"></img>
                        </>
                    )

                }) : null}
            </section>


        )
    } else {
        return (
            <>
                <Preloader />
            </>
        )
    }

})