import {applyMiddleware,combineReducers} from "redux";
import { legacy_createStore as createStore} from 'redux'
import thunk from "redux-thunk";
import { compose } from "redux";
import { appReducer } from "./AppReducer";
import { authReducer } from "./AuthReducer";
import { AccountReducer } from "./ProfileReducer";
import { UsersPageReducer } from "./UserPageReducer";
import { PostsReducer } from "./PostReducer";
import { SearchReducer } from "./UsersSerarchReducer";




let reducers = combineReducers({
    app : appReducer,
    auth : authReducer,
    account : AccountReducer,
    userPage : UsersPageReducer,
    userPosts : PostsReducer,
    search : SearchReducer
})

type PropertieTypes<T> = T extends {[key:string]:infer U} ? U : never;
export type InferActionType<T extends {[key:string]: (...args:any)=> any}> = ReturnType<PropertieTypes<T>>;
//Type of global reducer
type Root_reducer_type = typeof reducers;
//Recieving a state type from ReturnType from Root_reducer
export type Global_state_type = ReturnType<Root_reducer_type>;

const composeEnhancers = compose;
export const store = createStore(reducers,applyMiddleware(thunk));



//@ts-ignore
window.store = store;


