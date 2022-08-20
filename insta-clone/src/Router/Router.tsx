import { Route,Routes,Navigate } from "react-router-dom"
import { UserPage,  } from "../Components/UserPage"
import { UserType } from "../Redux/Types"

const LOGIN = "/login"
const CHAT = "/chat"
const USERS = "/users"
const USER_PROFILE = "/profile/:id"
const no_match_route = "*"
const NEW_POST = "/new_post"
const POST = "/profile/:id/post/:id"
const Empty = "";
const SEARCH = "/search"
const REGISTRATION = "/registration"
const ROOT = "/"




export const Router :React.FC<{actualUser : string,isAuth : boolean,}> = (props : {actualUser : string,isAuth : boolean,}) => {

    if(props.isAuth){
        return (
            <div className="Router">
                <Routes>
                    <Route path={LOGIN} element={<Navigate to={USER_PROFILE + "=" + props.actualUser}/>}/>
                    <Route path={ROOT} element={null}/>
                    <Route path={USER_PROFILE} element={<UserPage/>}/>
                </Routes>
            </div>
        )
    }else{
        return (
            <div className="Router">
                <Routes>
                    <Route path={LOGIN} element={null}/>
                    <Route path={no_match_route} element={<Navigate to={LOGIN} replace/>}/>
                    <Route path={REGISTRATION} element={null}/>
                </Routes>
            </div>
        )
    }

}