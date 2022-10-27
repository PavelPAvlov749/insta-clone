import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postActions } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import { PostType, UserType } from "../../Redux/Types";
import { userPageActions } from "../../Redux/UserPageReducer";
import { getAllUsersThunk, searchUserPageByName } from "../../Redux/UserSearchReducer";
import styles from "../../Styles/Search.module.css"
import { Avatar } from "../UserPage/Avatar";
import { LineLoader } from "./LoaderLine";


export const UserSearch: React.FC = React.memo((props) => {
    const navigate = useNavigate()
    const dispatch: any = useDispatch()
    let [onSearch,setOnSearch] = useState(false)

    //Get finded users or just all users(if the user has not searched for anything yet) from redux
    const users = useSelector((state: Global_state_type) => {
        return state.search.users
    })
    //Fist get all users
    useEffect(() => {
        dispatch(getAllUsersThunk())
    }, [])

    //onChange
    const onChangeHandler = (e: any) => {
       
        if (e.currentTarget.value.length > 0) {
            setOnSearch(true)
            dispatch(searchUserPageByName(e.currentTarget.value))
        } else {
            dispatch(getAllUsersThunk())
        }

    }
    //Redirrect to the specific user
    const setCurrentUserPage = (userID: string) => {
        dispatch(userPageActions.get_user(null as unknown as UserType))
        
        navigate("/profile/id=" + userID)
    }


    return (
        <section className={styles.searchWrapper}>
            <input type="text" placeholder="find users" onChange={onChangeHandler} onBlur={() => {
                setOnSearch(false)
            }}></input>
            <section className={styles.searchResults}>
                {!onSearch ? users?.map((user) => {
                    return (
                        <div className={styles.userMiniPage} key={user.userID} onClick={() => {
                            setCurrentUserPage(user.userID)
                        }}>
                            <Avatar avatarIMG={user.avatar} userID={user.userID} fullName={user.fullName} size={"small"}/>
                            <span className={styles.userName}>{user.fullName}</span>
                           
                        </div>
                    )

                }) : <LineLoader/>}
     
            </section>

        </section >
    )

})