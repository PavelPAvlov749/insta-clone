import { Action } from "redux";
import { InferActionType } from "./Store";
import { Dispatch } from "redux"
import { ThunkAction } from "redux-thunk"
import { Global_state_type } from "../Redux/Store";
import { getAuth, signInWithEmailAndPassword, } from "firebase/auth";

import { app_actions } from "./AppReducer";
import { AccountActions, updateStatusThunk } from "./ProfileReducer";
import { fireStoreAPI, firestoreUSersAPI } from "../DAL/Firestore";
import { userPageActions } from "./UserPageReducer";
import { UserType } from "./Types";


//Creating a type for auth_reducer action creator functions
export type Action_Type = InferActionType<typeof auth_actions>;
export type Dispatch_type = Dispatch<Action_Type>;
export type Thunk_type = ThunkAction<void, Global_state_type, unknown, Action_Type>;

export type CommonThunkType<A extends Action, R = Promise<void>> = ThunkAction<R, Global_state_type, unknown, Action_Type>;


const SET_AUTH_TRUE = "messenger/auth_reducer/set_true";
const SET_AUTH_FALSE = "messenger/auth_reducer/set_false";
const SET_TOKEN = "messenger/auth_reducer/set_token";
const CREATE_USER = "messenger/auth_reducer/create_user";
const SET_ERROR = "messenger/authReducer/setError"


let initial_state: initial_state_type = {
    is_auth: false,
    auth_token: null as unknown as string,
    is_initialize: false,
    user_id: null as unknown as string,
    onError: false,
    regForm: {
        username: "",
        email: "",
        passTake1: "",
        passTake2: "",
        avatar: null as unknown as string,
        status: null as unknown as string
    }

}
type initial_state_type = {
    is_auth: boolean,
    auth_token: string | undefined,
    is_initialize: boolean,
    user_id: string,
    onError: boolean,
    regForm: {
        username: string,
        email: string,
        passTake1: string,
        passTake2: string,
        avatar: string | null,
        status: string
    }
}

export const authReducer = (state = initial_state, action: Action_Type) => {
    switch (action.type) {
        case CREATE_USER: {
            return {
                ...state,
                user_id: action.payload
            }
        }
        case SET_ERROR: {
            return {
                ...state,
                onError: action.payload
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
    } as const),
    setError: (isError: boolean) => ({
        type: "messenger/authReducer/setError",
        payload: isError
    } as const),

}

export const CheckAuthThunk = () => {
    const authInstance = getAuth()
    return async function (dispatch: any) {

    }
}
export const logOutThunk = () => {
    return async function (dispatch: any) {
        firestoreUSersAPI.logOut()
        dispatch(AccountActions.set_current_user_profile(null))
        dispatch(app_actions.setCurrentUserID(null))
        dispatch(userPageActions.get_user(null))
        dispatch(AccountActions.updateAvatar(null))
        dispatch(userPageActions.setStatus(null as unknown as string))
        dispatch(auth_actions.set_auth_false())
    }
}
export const signInWithGooglePopUp = () => {
    return async function (dispatch: any) {
        try {
            const authResult = await fireStoreAPI.logInWithGooglePopUp()
            if (authResult) {
                dispatch(userPageActions.get_user(authResult as unknown as UserType))
                dispatch(auth_actions.set_auth_true())

            } else {
                dispatch(auth_actions.set_auth_false())
                throw new Error("Authorization Error")
            }
        } catch (ex) {
            console.log(ex)
        }

    }
}

export const loginInWithEmailAndPassword = (email: string, password: string) => {
    return async function (dispatch: any) {
        try {
            dispatch(app_actions.set_is_fetch_true())
            const user = await (await signInWithEmailAndPassword(firestoreUSersAPI.getAuth, email, password).catch((error) => {
                throw new Error(error)
            }).then((user) => {
                console.log(user)
                dispatch(auth_actions.create_user(user.user.uid))
                dispatch(auth_actions.set_auth_true())
                dispatch(app_actions.set_is_fetch_fasle())
            }))

        } catch (ex) {
            dispatch(auth_actions.setError(true))
            dispatch(auth_actions.set_auth_false())
            dispatch(app_actions.set_is_fetch_fasle())
            console.log(ex)
        }

    }
}

export const createUserByEmailAndPassword = (email: string, password: string, userName: string, avatar: string | ArrayBuffer | null, status: string) => {
    return async function (dispatch: any) {
        try {
           

                // const newUser: DataSnapshot | undefined = await authAPI.createUserWithEmailAndPassword(email, password, userName)
                const newUser : any = await firestoreUSersAPI.createNewUserWithEmailAndPassword(email,password,userName)
                await dispatch(updateStatusThunk(newUser.userID, newUser.status))
                await dispatch(app_actions.setCurrentUserID(newUser?.userID as string))
                console.log(newUser)
                debugger
                dispatch(AccountActions.set_current_user_profile(newUser))
                dispatch(auth_actions.set_auth_true())
  
        } catch (ex) {
            console.error(ex)
        }
    }
}