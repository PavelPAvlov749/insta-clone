import { UserProfile } from "firebase/auth";
import path from "path";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

import { Global_state_type } from "../../Redux/Store";
import { UserPagePreview } from "../../Redux/Types";
import {getFolloewrsThunk,getFollowedthunk, searchActions} from "../../Redux/UserSearchReducer"
import styles from "../../Styles/Followers.module.css"
import { Avatar } from "../UserPage/Avatar";

export const Followers : React.FC = React.memo((props) => {
    const location = useLocation().pathname.split("/")[3]
    const userID = useLocation().pathname.split("=")[1].split("/")[0]
    const dispatch : any = useDispatch()
    const usersList : Array<UserPagePreview> | undefined = useSelector((state: Global_state_type) => {
        if(location === "followers"){
            return state.search.followers
        }else{
            return state.search.followed
        }
    })
    useEffect(() => {
        if(location === "followers") {
            
            // dispatch(searchActions.getFollowed(null as unknown as Array<UserPagePreview>))
            dispatch(getFolloewrsThunk(userID))
        }else{
            // dispatch(searchActions.getFollowed(null as unknown as Array<UserPagePreview>))
            dispatch(getFollowedthunk(userID))
        }
    },[])
    

    return (
        <div>
            <div className={styles.usersListContainer}>
                <h1>{location === "followers" ? "Followers" : "Followed"}</h1>
                <ul>
                    { usersList ? usersList.map((el : UserPagePreview) => {
                        console.log(el.fullName)
                        return (
                            <li>
                                <NavLink to={`/profile/id=${el.userID}`}>
                                <Avatar size="small" avatarIMG={el.avatar} fullName={el.fullName}/>
                                <span>{el.fullName}</span>
                                </NavLink>
                       
                            </li>
                        )
                    }) : null}
                </ul>
            </div>
        </div>
    )
})