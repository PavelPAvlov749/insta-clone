import { displayPartsToString } from "typescript";
import { usersAPI } from "../DAL/UsersAPI";
import { appReducer, app_actions } from "./AppReducer";
import { InferActionType } from "./Store";
import { UserType } from "./Types";

const GET_USERS = "messenger/Users_reducer/get_users";
const SET_STATUS = "instaClone/UsersReducer/setNewStatus"
const FOLLOW = "instaClone/UsersReducer/follow"
const UNFOLLOW = "instaClone/UsersReducer/unfollow"

type ActionType = InferActionType<typeof userPageActions>
type initStateType = UserType

const initial_state : UserType = {
    fullName: null as unknown as string,
    avatar: null as unknown as string,
    status: null as unknown as string,
    userID: null as unknown as string,
    subscribes: [] as unknown as Array<string>,
    followers: [] as unknown as Array<string>,
    followed : false
}

export const UsersPageReducer = (state = initial_state, action: ActionType) => {
    switch (action.type) {
        case GET_USERS: {
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
                followers : state.followers?.push(action.payload)
            }
        }
        case UNFOLLOW : {
            return {
                ...state,
                followers :  state.followers?.map((user) => {
                    if(user !== action.payload) {
                        return user
                    }
                })
            }
        }
        default: return state
    }
}

export const userPageActions = {
    get_users: (user: UserType) => ({
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
    } as const )
}

export const getUserPageByID = (userID : string) => {
    return async function (dispatch : any) {

        const user = await usersAPI.getUserPageById(userID)
        if(user) {
            dispatch(userPageActions.get_users(user))
           
        }
        
    }
}