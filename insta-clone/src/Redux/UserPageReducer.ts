import { profileAPI } from "../DAL/ProfileApi";
import { usersAPI } from "../DAL/UsersAPI";
import { appReducer, app_actions } from "./AppReducer";
import { InferActionType } from "./Store";
import { ChatType, UserType } from "./Types";

const GET_USER = "messenger/Users_reducer/get_users";
const SET_STATUS = "instaClone/UsersReducer/setNewStatus"
const FOLLOW = "instaClone/UsersReducer/follow"
const UNFOLLOW = "instaClone/UsersReducer/unfollow"
const UPDATE_STATUS = "instaClone/profileReducer/updateStatus"


type ActionType = InferActionType<typeof userPageActions>
type initStateType = UserType

const initial_state : UserType = {
    fullName: null as unknown as string,
    avatar: null as unknown as string,
    status: null as unknown as string,
    userID: null as unknown as string,
    subscribes: [] as unknown as Array<string>,
    followers: [] as unknown as Array<string>,
    followed : false,
    
}

export const UsersPageReducer = (state = initial_state, action: ActionType) => {
    switch (action.type) {
        case GET_USER: {
            return {
                ...state,...action.payload
            }
        }
        case SET_STATUS : {
            return {
                ...state,
                status : action.payload
            }
        }
        case FOLLOW : {
            return {
                ...state,
                followers : state.followers?.concat(action.payload)
            }
        }
        case UNFOLLOW : {
            return {
                ...state,
                followers : state.followers?.filter(el => el !== action.payload)
            }
        }
        case UPDATE_STATUS : {
            return {
                ...state,
                status : action.payload
            }
        }


        default: return state
    }
}

export const userPageActions = {
    get_user: (user: UserType) => ({
        type: "messenger/Users_reducer/get_users",
        payload: user
    } as const),
    setStatus : (status : string) => ({
        type : "instaClone/UsersReducer/setNewStatus",
        payload : status
    }as const),
    follow : (userID : string) => ({
        type : "instaClone/UsersReducer/follow",
        payload : userID
    } as const ),
    unfollow : (userID : string) => ({
        type : "instaClone/UsersReducer/unfollow",
        payload : userID
    } as const ),
    updateStatus : (status : string) => ({
        type : "instaClone/profileReducer/updateStatus",
        payload : status
    } as const ),

}

export const getUserPageByID = (userID : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        const user = await usersAPI.getUserPageById(userID)

        if(user) {
            dispatch(userPageActions.get_user(user))
            dispatch(app_actions.set_is_fetch_fasle())
        }else{
            dispatch(app_actions.set_is_fetch_fasle())
        }
        
    }
}

export const updateStatusThunk = (userID : string,newStatusText : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        const newStatus = await profileAPI.updateStatus(userID,newStatusText)
        dispatch(userPageActions.updateStatus(newStatusText))
        dispatch(app_actions.set_is_fetch_fasle())
    }
}

export const followTooglethunk = (currentUserID: string,userID : string) => {
    return async function (dispatch: any) {
        dispatch(app_actions.set_is_fetch_true())
        const result = await usersAPI.followUser(currentUserID,userID)
        dispatch(app_actions.set_is_fetch_fasle())
    }
}

    