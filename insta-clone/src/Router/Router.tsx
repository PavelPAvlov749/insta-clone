import { Route,Routes,Navigate } from "react-router-dom"
import { Chat } from "../Components/Chat/Chat"
import { Login_container } from "../Components/Login/Login"
import { Registration } from "../Components/Login/Registartion"
import { ShowedPost } from "../Components/Posts/OpenedPost"
import { UserPage,  } from "../Components/UserPage/UserPage"
import { UserSearch } from "../Components/UserSearch/UserSearch"


const LOGIN = "/login"
const CHAT = "/chat"
const USERS = "/users"
const USER_PROFILE = "/profile/:id"
const no_match_route = "*"
const NEW_POST = "/new_post"
const POST = "/p/:id"
const Empty = "";
const SEARCH = "/search"
const REGISTRATION = "/registration"
const ROOT = "/"
const DIRECT = "chat/:id"



export const Router :React.FC<{actualUser : string,isAuth : boolean,}> = (props : {actualUser : string,isAuth : boolean,}) => {

    if(props.isAuth){
        return (
            <div className="Router">
                <Routes>
                    <Route path={LOGIN} element={<Navigate to={USER_PROFILE + "=" + props.actualUser}/>}/>
                    <Route path={ROOT} element={null}/>
                    <Route path={USER_PROFILE} element={<UserPage/>}/>
                    <Route path={POST} element={<ShowedPost/>}/>
                    <Route path={SEARCH} element={<UserSearch/>}/>
                    <Route path={CHAT} element={<Chat/>}/>
                    <Route path={DIRECT} element={<Chat/>}/>
                </Routes>
            </div>
        )
    }else{
        return (
            <div className="Router">
                <Routes>
                    <Route path={LOGIN} element={<Login_container/>}/>
                    <Route path={no_match_route} element={<Navigate to={LOGIN} replace/>}/>
                    <Route path={REGISTRATION} element={<Registration/>}/>
                </Routes>
            </div>
        )
    }

}