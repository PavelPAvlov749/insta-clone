import { disableNetwork } from "firebase/firestore"
import { act } from "react-dom/test-utils"
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript"
import { postAPI } from "../DAL/PostApi"
import { app_actions } from "./AppReducer"
import { InferActionType } from "./Store"
import { ComentType, PostType } from "./Types"




const GET_POSTS = "messenger/posts_reducer/get_post"
const SET_SHOWED_POST = "messenger/posts_reducer/set_showed_post"
const ISPOSTSFETCH = "messenger/posts_reducer/isPostFetch"
const LIKE = "messenger/posts_reducer/like"
const DISLIKE = "messenger/posts_reducer/dislike"
const ADD_COMENT = "messenger/posts_reducer/addComent"
const DELETE_COMENT = "messenger/psts_reducer/deleteComent"
const SET_NEW_COMENT = "messenger/posts_reducer/setNewComent"
const SET_ON_NEW_POST = "insta-clone/postReducer/setIsOnNewPost"
const SET_NEW_POST_PHOTO = "insta-clone/postReducer/setNewPostPhoto"

type ActionType = InferActionType<typeof postActions>
type initial_state_type = {

}

export let initial_state = {
    posts : [] as unknown as Array<PostType>,
    newPost : null as unknown as PostType,
    currentPost : null as unknown as PostType,
    isOnNewPost : false,
    newPostPhoto : null as unknown as string
}


export const PostsReducer = (state = initial_state, action: ActionType) => {
    switch (action.type) {
        case GET_POSTS: {
            return {
                ...state,
                posts : action.payload
            }
        }
        case SET_SHOWED_POST  : {
            return {
                ...state,
                currentPost : action.payload
            }
        }
        case LIKE : {
            return {
                ...state,
                currentPost : state.currentPost,likes_count : [state.currentPost.likes_count.push(action.payload)]
                
                }
                    
            
        }
        case DISLIKE : {
            return {
                ...state,
                currentPost : state.currentPost,likes_count : [state.currentPost.likes_count.pop()]
            }
        }
        case SET_ON_NEW_POST : {
            return {
                ...state,
                isOnNewPost : action.payload
            }
        }
        case SET_NEW_POST_PHOTO : {
            return {
                ...state,
                newPostPhoto : action.payload
            }
        }
        default:
            return state
    }
}

export const postActions = {
    getPosts: (_posts: Array<PostType>) => ({
        type: "messenger/posts_reducer/get_post",
        payload: _posts
    } as const),
    set_showed_post: (_post: PostType) => ({
        type: "messenger/posts_reducer/set_showed_post",
        payload: {
            post_text : _post.post_text,
            post_img : _post.post_img,
            id : _post.id,
            likes_count : Object.values(_post.likes_count),
            creator : _post.creator,
            createdAt : _post.createdAt,
            coments : Object.values(_post.coments),
        }
    } as const),
    setIsPostFetch: (isFetch: boolean) => ({
        type: "messenger/posts_reducer/isPostFetch",
        payload: isFetch
    } as const),
    addComent: (coment: ComentType) => ({
        type: "messenger/posts_reducer/addComent",
        payload: coment
    } as const),
    deleteComent: (comentID: string) => ({
        type: "messenger/psts_reducer/deleteComent",
        payload: comentID
    } as const),
    setNewComent: (text: string) => ({
        type: "messenger/posts_reducer/setNewComent",
        payload: text
    } as const),
    likeToogle: (userID: string) => ({
        type: "messenger/posts_reducer/like",
        payload: userID
    } as const),
    dislike : (userID: string) => ({
        type: "messenger/posts_reducer/dislike",
        payload: userID
    } as const),
    setIsOnnewPost : (isNewPost : boolean) => ({
        type : "insta-clone/postReducer/setIsOnNewPost",
        payload : isNewPost
    }as const),
    setNewPostPhoto : (img : any) => ({
        type : "insta-clone/postReducer/setNewPostPhoto",
        payload : img
    } as const  )
}

export const getPostListByUserID = (userID:string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        const posts = await (await postAPI.getListOfPosts(userID))
        if(posts) {
            dispatch(postActions.getPosts(Object.values(posts.val())))
            dispatch(app_actions.set_is_fetch_fasle())
        }

    }
}
