import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth_actions } from "./AuthReducer";
import { getAccountByID, AccountActions } from "./ProfileReducer";
import { InferActionType } from "./Store";




const SET_INITIALIZE = "SET_INITIALIZE";
const SET_IS_FETCH_TRUE = "messenger/app_reducer/set_is_fetch_true";
const SET_IS_FETCH_FALSE = "messenger/app_reducer/set_is_fetch_false";
const SET_CURRENT_USER_ID = "messenger/app_reducer/set_current_user_id";
const SET_ON_LOAD = "insta-clone/postReducer/set_on_load"


let initial_state = {
    is_initialize: false,
    is_fetch: false,
    currentUserID: null as unknown as string,
    onLoad : false
}

//Acrtion types
type Action_Type = InferActionType<typeof app_actions>;

export const appReducer = (state = initial_state, action: Action_Type) => {
    switch (action.type) {
        case SET_INITIALIZE: {
            return {
                ...state,
                is_initialize: action.payload
            }
        }
        case SET_IS_FETCH_TRUE: {
            return {
                ...state,
                is_fetch: true
            }
        }
        case SET_IS_FETCH_FALSE: {
            return {
                ...state,
                is_fetch: false
            }
        }
        case SET_CURRENT_USER_ID: {
            return {
                ...state,
                currentUserID: action.payload
            }
        }
        case SET_ON_LOAD : {
            return {
                ...state,
                onLoad : action.payload
            }
        }
        default:
            return state
    }
}

export const app_actions = {
    //Initialize action
    init: (isInit : boolean) => (
        {
            type: "SET_INITIALIZE",
            payload : isInit

        } as const),
    set_is_fetch_true: () => (
        {
            type: "messenger/app_reducer/set_is_fetch_true",

        } as const),
    set_is_fetch_fasle: () => (
        {
            type: "messenger/app_reducer/set_is_fetch_false",

        } as const),
    setCurrentUserID: (userID: string) => ({
        type: "messenger/app_reducer/set_current_user_id",
        payload: userID
    }as const ),
    setOnLoad : (isLoad: boolean) => ({
        type : "insta-clone/postReducer/set_on_load",
        payload : isLoad
    } as const  )

}

export const InitializeThunk = ()  => {
    let auth = getAuth()
    return async function (dispatch : any) {
        dispatch(auth_actions.set_auth_true())
        dispatch(app_actions.set_is_fetch_true())
        onAuthStateChanged(auth,(user) => {
            dispatch(app_actions.init(false))
            if(user !== null){
                dispatch(app_actions.setCurrentUserID(user?.uid as string))
                dispatch(getAccountByID(user.uid))
        
                dispatch(auth_actions.set_auth_true())
                dispatch(app_actions.set_is_fetch_fasle())
                dispatch(app_actions.init(true))
            }else{
                console.log("NOT_AUTHORIZED")
                dispatch(auth_actions.set_auth_false())
                dispatch(app_actions.set_is_fetch_fasle())
                dispatch(app_actions.init(true))
                
            }
        })
        
    }
}