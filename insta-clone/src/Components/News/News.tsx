import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, likeToogleThunk } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import { Preloader } from "../Preloader/Preloader";
import styles from "../../Styles/News.module.css"
import { PostType } from "../../Redux/Types";
import { NavLink } from "react-router-dom";
import { Avatar } from "../UserPage/Avatar";


const PostNews: React.FC<{ post: PostType, currentUserId: string }> = React.memo((props) => {
    const dispatch = useDispatch()
    const tapLikeHandler = function () {

    }
    const onComentClickHandler = function () {

    }
    return (
        <section>
            <NavLink to={`/profile/id:=${props.post.creator}`} className={styles.creatorInfo}>
                <Avatar avatarIMG={props.post.creatorAvatar} fullName={props.post.creator} size="small" />
                <h1 className={styles.autorName}>{props.post.creator}</h1>
                <div className={styles.hr}></div>
            </NavLink>

            <NavLink to={`/p/id=${props.post.id}`}>
                <div className={styles.postIMGContainer}>
                    <img className={styles.postIMG} src={props.post.post_img} alt="" />
                </div>
            </NavLink>


        </section>
    )
})


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
    const ScrollToTop = function () {

    }
    if (posts) {
        return (
            <section className={styles.news}>

                <button type="button" onClick={ScrollToTop}>Top</button>

                {posts.length ? posts.map((post) => {
                    return (
                        <>
                            <PostNews post={post} currentUserId={currentUserID as string} />
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