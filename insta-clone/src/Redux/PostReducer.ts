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
const SET_NEW_POST_TEXT = "insta-clone/postReducer/setNewPostText"
const CREATE_POST = "insta-clone/postReducer/createPost"


type ActionType = InferActionType<typeof postActions>
type initial_state_type = {

}

export let initial_state = {
    posts : [] as unknown as Array<PostType>,
    newPost : null as unknown as PostType,
    currentPost : null as unknown as PostType,
    isOnNewPost : false,
    newPostPhoto : null as unknown as string,
    newPostText : "",
}


export const PostsReducer = (state = initial_state, action: ActionType) => {
    switch (action.type) {
        case GET_POSTS: {
            return {
                ...state,
                posts : action.payload
            }
        }
        case CREATE_POST : {
            return {
                ...state,
                posts : {...state.posts.concat(action.payload)}
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
                currentPost : {...state.currentPost,likes_count : state.currentPost.likes_count.concat(action.payload)}
                
                }
                    
            
        }
        case DISLIKE : {
            return {
                ...state,
                currentPost : {...state.currentPost,likes_count : state.currentPost.likes_count.filter(el => el !== action.payload)}
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
        case SET_NEW_POST_TEXT : {
            return {
                ...state,
                newPostText : state.newPostText.concat(action.payload)
            }
        }
        case ADD_COMENT : {
            return {
                ...state,
                currentPost : {...state.currentPost,coments : state.currentPost.coments.concat(action.payload.coment)}
     
            }
        }
        case DELETE_COMENT : {
            return {
                ...state,
                currentPost : {...state.currentPost,coments : state.currentPost.coments.filter(el => el.comentID !== action.payload)}
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
            likes_count : Object.hasOwn(_post,"likes_count") ?  Object.values(_post.likes_count) : [] as Array<string>,
            creator : _post.creator,
            createdAt : _post.createdAt,
            coments : Object.hasOwn(_post,"coments") ? Object.values(_post.coments) : [] as Array<ComentType>,
            creatorID : _post.creatorID,
            creatorAvatar : _post.creatorAvatar
        }
    } as const),
    setIsPostFetch: (isFetch: boolean) => ({
        type: "messenger/posts_reducer/isPostFetch",
        payload: isFetch
    } as const),
    addComent: (postID : string, coment: ComentType) => ({
        type: "messenger/posts_reducer/addComent",
        payload: {coment : coment,postID : postID}
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
    } as const  ),
    setNewPosttext : (postText : string) => ({
        type : "insta-clone/postReducer/setNewPostText",
        payload : postText
    } as const ),
    createPost : (post : PostType) => ({
        type : "insta-clone/postReducer/createPost",
        payload : post
    } as const )
}

export const getPostListByUserID = (userID:string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        const posts = await (await postAPI.getListOfPosts(userID))
        if(posts.val()) {
            dispatch(postActions.getPosts(Object.values(posts.val())))
            dispatch(app_actions.set_is_fetch_fasle())
        }else{
            dispatch(postActions.getPosts([] as Array<PostType>))
            dispatch(app_actions.set_is_fetch_fasle())
        }

    }
}
export const leaveComentThunk = (userID : string,postID:string,coment : ComentType) => {
    return async function (dispatch : any) {
        try{
            dispatch(app_actions.set_is_fetch_true())
            const newComent = await postAPI.addComentToPost(userID,postID,coment.coment_text as string,coment.comentatorName as string,coment.avatar as string)
            if(newComent){
                dispatch(postActions.addComent(postID,newComent))
                dispatch(app_actions.set_is_fetch_fasle())
            }

        }catch(ex){
            console.error(ex)
        }
    } 
}
export const getSinglePostByID = (postID : string) => {
    return async function (dispatch: any) {
        dispatch(app_actions.set_is_fetch_true())
        let post = await postAPI.getPostByID(postID)
        dispatch(postActions.set_showed_post(post))
     
        dispatch(app_actions.set_is_fetch_fasle())
    }
}
export const createNewPostThunk = (userID:string,postIMG : Blob | Uint8Array | ArrayBuffer,postText : string,postTags : string,userFullNAme : string,
    creatorID : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        dispatch(app_actions.setOnLoad(true))
        await postAPI.createPost(userID,postIMG,postText,postTags,userFullNAme,creatorID)
        dispatch(app_actions.set_is_fetch_fasle())
        dispatch(app_actions.setOnLoad(false))
        
    }
}
export const deleteComentThunk = (postID:string,comentID:string) =>{
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true)
        await postAPI.deleteComent(postID,comentID)
        dispatch(postActions.deleteComent(comentID))
        dispatch(app_actions.set_is_fetch_fasle())
    }
}
export const likeToogleThunk = (postID:string,currentUserID : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        try{
            await postAPI.addLikeToPost(currentUserID,postID)
            dispatch(app_actions.set_is_fetch_fasle())
        }catch(ex){
            console.error(ex)
        }
      
    }
}