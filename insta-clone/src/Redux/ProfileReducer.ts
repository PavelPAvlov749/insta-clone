import { authAPI } from "../DAL/AuthAPI";
import { profileAPI } from "../DAL/ProfileApi";
import { appReducer, app_actions } from "./AppReducer";
import { InferActionType } from "./Store";
import { ChatType, MainAccountType } from "./Types";



const SET_CURRENT_USER_PROFILE = "instaClone/profile_reducer/set_current_user+profile"
const UPDATE_AVATAR = "instaClone/profileReducer/updateAvatar"
const UPDATE_STATUS = "instaClone/profileReducer/updateStatus"

type ActionType = InferActionType<typeof AccountActions>;



type initial_state_type = {
    userID: string | null,
    fullName: string | null,
    avatar: string | null,
    status : string | null,
    chats : Array<ChatType> | null 
}

let initial_state: initial_state_type = {
    userID: null as unknown as string,
    fullName: null as unknown as string,
    avatar: null as unknown as string,
    status : null as unknown as string,
    chats : [] as unknown as Array<ChatType>
}

export const AccountReducer = (state = initial_state, action: ActionType) => {
    switch (action.type) {
        case SET_CURRENT_USER_PROFILE:
            {
                return {
                    ...state,
                    ...action.payload
                }
            }
        case UPDATE_AVATAR : {
            return {
                ...state,
                avatar : action.payload
            }
        }
        case UPDATE_STATUS : {
            return {
                ...state,
                status : action.payload
            }
        }

        default:
            return state
    }
}

export const AccountActions = {
    set_current_user_profile: (_profile: MainAccountType) => ({
        type: "instaClone/profile_reducer/set_current_user+profile",
        payload: _profile
    } as const),
    get_status: (status: string) => ({
        type: "messenger/profile_reducer/get_status",
        payload: status
    } as const),
    updateAvatar : (newAvatar : any ) => ({
        type : "instaClone/profileReducer/updateAvatar",
        payload : newAvatar
    } as const),
    updareStatus : (status : string) => ({
        type : "instaClone/profileReducer/updateStatus",
        payload : status
    } as const)
}

export const getAccountByID = (userID: string) => {
    return async function (dispatch: any) {
        try {
            dispatch(app_actions.init(false))
            let response = await authAPI.getAccount(userID)
            if (response) {
                let user = {
                    fullName: response?.fullName,
                    avatar: response?.avatar,
                    userID: response?.userID,
                    status : response?.status,
                    chats : response.chats
                }
                dispatch(AccountActions.set_current_user_profile(user))
                dispatch(app_actions.init(true))
            } else {
                throw new Error()
            }

        }catch(ex){
            console.error(ex)
        }
        }

}

export const updateAvatarThunk = (newAvatar : any,userID : string) => {
    return async function (dispatch: any) {
        try{
            dispatch(app_actions.set_is_fetch_true())
            let updatedAvatar = await profileAPI.updateAvatar(userID,newAvatar)
            dispatch(AccountActions.updateAvatar(updatedAvatar))
           
            dispatch(app_actions.set_is_fetch_fasle())
        }
        catch(ex) {
            console.error(ex)
        }

    }
}
export const updateStatusThunk = (userID : string,newStatusText : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        const newStatus = await profileAPI.updateStatus(userID,newStatusText)
        dispatch(AccountActions.updareStatus(newStatusText))
        dispatch(app_actions.set_is_fetch_fasle())
    }
}