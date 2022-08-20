import { authAPI } from "../DAL/AuthAPI";
import { profileAPI } from "../DAL/ProfileApi";
import { usersAPI } from "../DAL/UsersAPI";
import { appReducer, app_actions } from "./AppReducer";
import { InferActionType } from "./Store";
import { MainAccountType } from "./Types";



const SET_CURRENT_USER_PROFILE = "messenger/profile_reducer/set_current_user+profile"


type ActionType = InferActionType<typeof AccountActions>;



type initial_state_type = {
    userID: string | null,
    fullName: string | null,
    avatar: string | null,
}

let initial_state: initial_state_type = {
    userID: null as unknown as string,
    fullName: null as unknown as string,
    avatar: null as unknown as string,
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

        default:
            return state
    }
}

export const AccountActions = {
    set_current_user_profile: (_profile: MainAccountType) => ({
        type: "messenger/profile_reducer/set_current_user+profile",
        payload: _profile
    } as const),
    get_status: (status: string) => ({
        type: "messenger/profile_reducer/get_status",
        payload: status
    } as const),
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
                    userID: response?.userID
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