import { InferActionType } from "./Store"
import { ComentType, PostType } from "./Types"




const GET_POSTS = "messenger/posts_reducer/get_post"
const SET_SHOWED_POST = "messenger/posts_reducer/set_showed_post"
const ISPOSTSFETCH = "messenger/posts_reducer/isPostFetch"
const LIKE_TOOGLE = "messenger/posts_reducer/likeToogle"
const ADD_COMENT = "messenger/posts_reducer/addComent"
const DELETE_COMENT = "messenger/psts_reducer/deleteComent"
const SET_NEW_COMENT = "messenger/posts_reducer/setNewComent"

type ActionType = InferActionType<typeof postActions>
type initial_state_type = {

}

export let initial_state = {
    posts : [] as unknown as Array<PostType>,
    currentPost : null as unknown as PostType,
    newPost : null as unknown as PostType,
}


export const PostsReducer = (state = initial_state, action: ActionType) => {
    switch (action.type) {
        case GET_POSTS: {
            return {
            
            }
        }
        case SET_SHOWED_POST: {
            return {

            }
        }
        case ISPOSTSFETCH: {
            return {

            }
        }
        case ADD_COMENT: {
            return {

            }
        }
        case DELETE_COMENT: {
            return {

            }
        }

        case SET_NEW_COMENT: {
            return {

            }
        }
        case LIKE_TOOGLE: {
            return {

            }
        }
        default:
            return state
    }
}

export const postActions = {
    get_posts: (_posts: Array<PostType>) => ({
        type: "messenger/posts_reducer/get_post",
        payload: _posts
    } as const),
    set_showed_post: (_post: any) => ({
        type: "messenger/posts_reducer/set_showed_post",
        payload: _post
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
        type: "messenger/posts_reducer/likeToogle",
        payload: userID
    } as const)
}

