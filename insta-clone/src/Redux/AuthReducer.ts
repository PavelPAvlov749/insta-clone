import { Action } from "redux";
import { InferActionType } from "./Store";
import { Dispatch } from "redux"
import { ThunkAction } from "redux-thunk"
import { Global_state_type } from "../Redux/Store";
import { getAuth } from "firebase/auth";



//Creating a type for auth_reducer action creator functions
export type Action_Type = InferActionType<typeof auth_actions>;
export type Dispatch_type = Dispatch<Action_Type>;
export type Thunk_type = ThunkAction<void, Global_state_type, unknown, Action_Type>;

export type CommonThunkType<A extends Action, R = Promise<void>> = ThunkAction<R, Global_state_type, unknown, Action_Type>;


const SET_AUTH_TRUE = "messenger/auth_reducer/set_true";
const SET_AUTH_FALSE = "messenger/auth_reducer/set_false";
const SET_TOKEN = "messenger/auth_reducer/set_token";
const CREATE_USER = "messenger/auth_reducer/create_user";

let initial_state: initial_state_type = {
    is_auth: false,
    auth_token: null as unknown as string,
    is_initialize: false,
    user_id: null as unknown as string
}
type initial_state_type = {
    is_auth: boolean,
    auth_token: string | undefined,
    is_initialize: boolean,
    user_id: string
}

export const authReducer = (state = initial_state, action: Action_Type) => {
    switch (action.type) {
        case CREATE_USER: {
            return {
                ...state,
                user_id: action.payload
            }
        }
        case SET_AUTH_TRUE: {
            return {
                ...state,
                is_auth: true
            }
        }
        case SET_AUTH_FALSE: {
            return {
                ...state,
                is_auth: false
            }
        }
        case SET_TOKEN: {
            return {
                ...state,
                auth_token: action.payload
            }
        }
        default:
            return state
    }
};

export const auth_actions = {
    set_auth_true: () => ({
        type: "messenger/auth_reducer/set_true",
        payload: true
    } as const),
    set_auth_false: () => ({
        type: "messenger/auth_reducer/set_false",

    } as const),
    set_auth_token: (_token: string) => ({
        type: "messenger/auth_reducer/set_token",
        payload: _token
    } as const),
    create_user: (_user_id: string) => ({
        type: "messenger/auth_reducer/create_user",
        payload: _user_id
    } as const)
}

export const CheckAuthThunk = () => {
    const authInstance = getAuth()
    return async function (dispatch : any) {
        
    }
}