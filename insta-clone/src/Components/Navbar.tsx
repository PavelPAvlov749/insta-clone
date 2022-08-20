import React, { useState } from "react";
import { Link, NavLink, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Global_state_type } from "../Redux/Store";

//IMPORTING INTERFACE ICONS
import style from "../Styles/Navbar.module.css";
import chat_img from "../Media/Chat.png";
import profile from "../Media/Profile.png";
import home from "../Media/Home.png"
import upload from "../Media/Upload.png";
import logout_img from "../Media/Logout.png";
import logo from '../Media/logo2.jpg'
import search from "../Media/search.png";





export const Navbar: React.FC = React.memo((props) => {
    let isAuth = useSelector((state:Global_state_type) => {
        return state.auth.is_auth
    })
    let currentUserUrl = useSelector((state:Global_state_type) => {
        return state.account.userID
    })
    const logOut = () => {

    }
    return (
        <section className={style.navbar_container}>
            <div className={style.navbar}>
                <img src={logo} alt="" className={style.logo} />
                <section className={style.navigation}>
                    <ul className={style.navigation_list}>
                    <li>
                            <NavLink to={`/search`}>
                                <img src={search} alt="#" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/chat">
                                <img src={chat_img} alt="#"
                                    style={{

                                    }} onClick={() => {
                                    }} />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`/profile/id=${currentUserUrl}`}>
                                <img src={profile} alt="#" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/news">
                                <img src={home} alt="" />
                            </NavLink>
                        </li>
                        <li>
                            <img src={upload} alt="" onClick={() => {
                                //NAVIGATE FUNCTION
                            }} />
                        </li>
                        <li>
                            {isAuth ? <img src={logout_img} alt="" onClick={logOut} /> : null}
                        </li>
                    </ul>
                    
                </section>
              
            </div>
            <hr style={{ "width": "930px", "marginTop": "0px","color" : "green" }} />
        </section>

    )
});