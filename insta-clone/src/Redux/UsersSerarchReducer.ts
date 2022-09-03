import { usersAPI } from "../DAL/UsersAPI";
import { app_actions } from "./AppReducer";
import { InferActionType } from "./Store";
import { UserType } from "./Types";

const GET_USERS = "messenger/Users_reducer/get_users";


type ActionType = InferActionType<typeof usersActions>

const initial_state = {
    userNameToSearch : "",
    usersPages : [] as unknown as Array<UserType>,

}

export const SearchReducer = (state = initial_state, action: ActionType) => {
    switch (action.type) {
        case GET_USERS: {
            return {
                ...state,
                usersPages : action.payload
            }
        }
        default: return state
    }
}

export const usersActions = {
    getAllUsers: (user: Array<UserType>) => ({
        type: "messenger/Users_reducer/get_users",
        payload: user
    } as const),
}

export const getAllUsers = () => {
    return async function (dispatch: any) {
        dispatch(app_actions.set_is_fetch_true())
        let users = await usersAPI.getAllUsers()
        if(users){
            dispatch(usersActions.getAllUsers(Object.values(users)))
            dispatch(app_actions.set_is_fetch_fasle())
        }
    }
}