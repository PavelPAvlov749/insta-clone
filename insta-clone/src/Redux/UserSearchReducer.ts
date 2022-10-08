import { usersAPI } from "../DAL/UsersAPI"
import { app_actions } from "./AppReducer"
import { InferActionType } from "./Store"
import { UserType } from "./Types"

const GET_ALL_USERS = "messenger/usersSearchReducer/getAllUsers"
const GET_USER_PAGE = "messenger/usersSearchReducer/getUserPage"
const SET_SEARCHNAM = "messenger/userSearchReducer/setSearchName"
const SET_ON_SEARCH = "messenger/userSearchReducer/setOnSearch"
const GET_FOLOOWERS = "instaClone/userSearchReducer/getFollowers"
const GET_FOLLOWED = "instaClone/userSearchReducer/getFollowed"
type ActionType = InferActionType<typeof searchActions>
type initStateType = UserType

let initialState = {
    userToSearch : "",
    users : null as unknown as Array<UserType>,
    onSearch : false
    

}
export const usersSearchReducer = (state = initialState,action : ActionType ) =>{
    switch(action.type){
        case GET_ALL_USERS : {
            return {
                ...state,
                users : action.payload
            }
        }
        case SET_SEARCHNAM : {
            return {
                ...state,
                userToSearch : action.payload
            }
        }
        case GET_USER_PAGE : {
            return {
                ...state,
                users : action.payload
            }
        }
        case SET_ON_SEARCH : {
            return {
                ...state,
                onSearch : action.payload
            }
        }
        case GET_FOLOOWERS : {
            return {
                ...state,
                users : action.payload
            }
        }
        case GET_FOLLOWED : {
            return {
                ...state,
                users : action.payload
            }
        }
        default : return state
    }
}

export const searchActions = {
    getAllUsers : (users : Array<UserType>) => ({
        type : "messenger/usersSearchReducer/getAllUsers",
        payload : users
    } as const),
    setSearchName : (userName : string) => ({
        type : "messenger/userSearchReducer/setSearchName",
        payload : userName
    } as const ),
    getUserPage : (userPages : Array<UserType>) => ({
        type : "messenger/usersSearchReducer/getUserPage",
        payload : userPages
    } as const ),
    setOnSearch : (onSearch : boolean) => ({
        type : "messenger/userSearchReducer/setOnSearch",
        payload : onSearch
    } as const ),
    getFollowers : (users : Array<UserType>) => ({
        type : "instaClone/userSearchReducer/getFollowers",
        payload : users
    } as const ),
    getFollowed : (users : Array<UserType>) => ({
        type : "instaClone/userSearchReducer/getFollowed",
        payload : users 
    } as const)

}

export const getAllUsersThunk = () => {
    return async function (dispatch :any) {
        dispatch(app_actions.set_is_fetch_true())
        dispatch(searchActions.setOnSearch(true))
        let users = await usersAPI.getAllUsers()
        if(users){
            dispatch(searchActions.getAllUsers(Object.values(users)))
            dispatch(app_actions.set_is_fetch_fasle())
            dispatch(searchActions.setOnSearch(false))
           
        }else{
            dispatch(searchActions.setOnSearch(false))
            dispatch(app_actions.set_is_fetch_fasle())
        }
        
    }
}

export const searchUserPageByName = (userName : string) => {
    return async function (dispatch:any ) {
        dispatch(app_actions.set_is_fetch_true())
        dispatch(searchActions.setOnSearch(true))
        const userPage = await usersAPI.getUserPageByName(userName)
        if(userPage !== null){
            dispatch(searchActions.getAllUsers(userPage as Array<UserType>))
            dispatch(app_actions.set_is_fetch_fasle())
            dispatch(searchActions.setOnSearch(false))
        }
    }
}

export const getFolloewrsThunk = (userId : string) => {
    return async function (dispatch : any) {
        const users = await usersAPI.getFollowers(userId)
        if(users) {
            dispatch(searchActions.getFollowers(users))
        }
    }
}
export const getFollowedthunk = (userID : string) => {
    return async function (dispatch : any) {
        const users = await usersAPI.getFollowedUsers(userID)
        if(users) {
            dispatch(searchActions.getFollowed(users))
        }
    }
}