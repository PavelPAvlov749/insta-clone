import { User } from "firebase/auth";
import { firestoreUSersAPI } from "../DAL/Firestore";
import { profileAPI } from "../DAL/ProfileApi";
import { usersAPI } from "../DAL/UsersAPI";
import { appReducer, app_actions } from "./AppReducer";
import { InferActionType } from "./Store";
import { ChatType, UserPagePreview, UserType } from "./Types";

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
    followed: [] as Array<string>,
    followers: [] as Array<string>,

    
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
    get_user: (user: UserType | null) => ({
        type: "messenger/Users_reducer/get_users",
        payload: user
    } as const),
    setStatus : (status : string) => ({
        type : "instaClone/UsersReducer/setNewStatus",
        payload : status
    }as const),
    follow : (user : string) => ({
        type : "instaClone/UsersReducer/follow",
        payload : user
    } as const ),
    unfollow : (user : string) => ({
        type : "instaClone/UsersReducer/unfollow",
        payload : user
    } as const ),
    updateStatus : (status : string) => ({
        type : "instaClone/profileReducer/updateStatus",
        payload : status
    } as const ),

}

export const getUserPageByID = (userID : string) => {
    return async function (dispatch : any) {
       try{
        const user  = await firestoreUSersAPI.getUserPageByID(userID)
      
        if(user) {
            dispatch(userPageActions.get_user(user as UserType))
        }else{
            throw new Error("USer does not exist")
        }
       }catch(ex){
        console.log(ex)
       }

    }
}


export const followTooglethunk = (currentUser : UserPagePreview,userToFollow : UserPagePreview) => {
    return async function (dispatch: any) {
        dispatch(app_actions.set_is_fetch_true())
        
        const result = await firestoreUSersAPI.followToggle(userToFollow,currentUser)
        console.log(result)
        dispatch(app_actions.set_is_fetch_fasle())
    }
}

    