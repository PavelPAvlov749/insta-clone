import React from "react";
import { NavLink, } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//IMPORTING INTERFACE ICONS
import style from "../../Styles/Navbar.module.css";
import chat_img from "../../Media/Chat.png";
import profile from "../../Media/Profile.png";
import home from "../../Media/Home.png"
import upload from "../../Media/Upload.png";
import logout_img from "../../Media/Logout.png";

import search from "../../Media/search.png";

import { logOutThunk } from "../../Redux/AuthReducer";



type navbarPropsType = {
    isAuth : boolean,
    currentUserUrl : string
}

export const Navbar: React.FC<navbarPropsType> = React.memo((props : navbarPropsType) => {
    const dispatch: any = useDispatch()
    const logOut = () => {
        dispatch(logOutThunk())
    }

    return (
        <footer className={style.navbarContainer}>
                <ul className={style.navigation_list}>
                    <li>
                        <NavLink to={`/search`}>
                            <img src={search} alt="#" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/chat">
                            <img src={chat_img} alt="#"
                                onClick={() => {
                                }} />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/profile/id=${props.currentUserUrl}`}>
                            <img src={profile} alt="#" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/news">
                            <img src={home} alt="" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="newPost">
                            <img src={upload} alt="#" />
                        </NavLink>

                    </li>
                    <li>
                        {props.isAuth ? <img src={logout_img} alt="" onClick={logOut} /> : null}
                    </li>
                </ul>
          
        </footer>

    )
});