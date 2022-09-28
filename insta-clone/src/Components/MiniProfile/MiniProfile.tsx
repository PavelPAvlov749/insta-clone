import React from "react";
import { NavLink } from "react-router-dom";

type ProfileMiniType = {
    avatar : string | null,
    fullName : string,
    status? : string,
    userID : string,
    type? : "avatarAndName" | "avaatrAndButton" | "avatar"
}

export const MiniProfile : React.FC<ProfileMiniType> = React.memo ((props)=> {
    
    return (
        <section>
            <NavLink to={`/profile/id=${props.userID}`}>
                <img src={props.avatar ? props.avatar : "#"} alt="#"></img>
                
                <span>{props.fullName}</span>
                <br />  
                <span>{props.status ? props.status : null}</span>
            </NavLink>
        </section>
    )
})