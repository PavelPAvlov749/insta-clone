import { Action } from "redux";
import { InferActionType } from "./Store";
import { Dispatch } from "redux"
import { ThunkAction } from "redux-thunk"
import { Global_state_type } from "../Redux/Store";
import { authAPI } from "../../Temp/AuthAPI";
import { app_actions } from "./AppReducer";
import { AccountActions, updateAvatarThunk, updateStatusThunk } from "./ProfileReducer";
import { DataSnapshot } from "firebase/database";
import { CreateNewUserType } from "./Types";
import { auth_actions } from "./AuthReducer";
import { firestoreUSersAPI } from "../DAL/Firestore";


const SET_NEW_USER_EMAIL = "messenger/registrationReducer/setNewUserEmail"
const SET_NEW_USER_USERNAME = "messenger/registrationReducer/setNewUserUsername"
const SET_NEW_USER_PASSWORD_1 = "messenger/registrationReducer/setNewUserPassword"
const SET_NEW_USER_PASSWORD_2 = "messenger/registrationReducer/setNewUserPassword2"
const SET_NEW_USER_AVATAR = "messenger/registrationReducer/setNewUserAvatar"
const SET_NEW_USER_STATUS = "messenger/registrationReducer/setNewUserStatus"
const SET_NEW_USER_ID = "messenger/registrationReducer/setUserID"

//Creating a type for auth_reducer action creator functions
export type Action_Type = InferActionType<typeof RegistrationActions>;
export type Dispatch_type = Dispatch<Action_Type>;
export type Thunk_type = ThunkAction<void, Global_state_type, unknown, Action_Type>;
export type CommonThunkType<A extends Action, R = Promise<void>> = ThunkAction<R, Global_state_type, unknown, Action_Type>;

type initialStateType = {
    userName : string,
    password : string,
    confirmPassword : string,
    email : string,
    avatar : any,
    status : string,
    newUserID : string
}


const initialState : initialStateType = {
    userName : "",
    password : "",
    confirmPassword: "",
    avatar : null as unknown as string,
    email : "",
    status : "",
    newUserID :"",
}

export const RegistrationReducer = (state= initialState,action : Action_Type) => {
    switch(action.type){
        case SET_NEW_USER_USERNAME : {
            return {
                ...state,
                userName : state.userName.concat(action.payload)
            }
        }
        case SET_NEW_USER_PASSWORD_1 : {
            return {
                ...state,
                passwordField1 : action.payload
            }
        }
        case SET_NEW_USER_PASSWORD_2 : {
            return {
                ...state,
                passwordField2 : action.payload
            }
        }
        case SET_NEW_USER_EMAIL : {
            return {
                ...state,
                email : action.payload
            }
        }
        case SET_NEW_USER_AVATAR : {
            return {
                ...state,
                avatar : action.payload
            }
        }
        case SET_NEW_USER_ID : {
            return {
                ...state,
                newUserID : action.payload
            }
        }
        case SET_NEW_USER_STATUS : {
            return {
                ...state,
                status : action.payload
            }
        }
        default :
            return state
    }
}

export const RegistrationActions = {
    setUsername : (username : string) => ({
        type : "messenger/registrationReducer/setNewUserUsername",
        payload : username
    } as const ),
    setPasswordField1 : (password : string) => ({
        type : "messenger/registrationReducer/setNewUserPassword",
        payload : password
    } as const ),
    setPasswordField2 : (password : string) => ({
        type : "messenger/registrationReducer/setNewUserPassword2",
        payload : password
    } as const ),
    setAvatar : (avatar : any ) => ({
        type : "messenger/registrationReducer/setNewUserAvatar",
        payload : avatar
    } as const ),
    setEmail : (email : string) => ({
        type : "messenger/registrationReducer/setNewUserEmail",
        payload : email
    } as const ),
    setStatus : (status : string) => ({
        type : "messenger/registrationReducer/setNewUserStatus",
        payload : status
    } as const ),
    setUsetId : (userID : string) => ({
        type : "messenger/registrationReducer/setUserID",
        payload : userID
    } as const )
}


export const  CreateNewUserWithEmailAndPassword = (newUserData : CreateNewUserType) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        dispatch(app_actions.init(false))
        const newUser : any = firestoreUSersAPI.createNewUserWithEmailAndPassword(newUserData.email,newUserData.password,newUserData.userName)
        await dispatch(app_actions.setCurrentUserID(newUser?.userID))
        dispatch(AccountActions.set_current_user_profile(newUser))
        dispatch(auth_actions.set_auth_true())
        dispatch(app_actions.set_is_fetch_fasle())
        dispatch(app_actions.init(true))

    }
}