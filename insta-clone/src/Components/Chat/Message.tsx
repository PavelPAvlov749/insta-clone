import React from "react";
import { NavLink } from "react-router-dom";

type MessagePropsType = {
    messageText: string,
    avatar: string | null,
    userName: string,
    userID: string
}

export const Message: React.FC<MessagePropsType> = React.memo((props) => {
    return (
        <section>
            <NavLink to={`/profile/id=${props.userID}`}>
                <img src={props.avatar ? props.avatar : "#"} alt="#"></img>
                <span>{props.userName}</span>
            </NavLink>

            <hr />
            <span>{props.messageText}</span>
        </section>
    )
})