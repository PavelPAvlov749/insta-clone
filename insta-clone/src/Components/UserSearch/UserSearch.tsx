import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Global_state_type } from "../../Redux/Store";
import { getAllUsersThunk, searchUserPageByName } from "../../Redux/UserSearchReducer";
import styles from "../../Styles/Search.module.css"
import { LineLoader } from "./LoaderLine";


export const UserSearch: React.FC = React.memo((props) => {
    const navigate = useNavigate()
    const dispatch: any = useDispatch()

    //Get finded users or just all users(if the user has not searched for anything yet) from redux
    const users = useSelector((state: Global_state_type) => {
        return state.search.users
    })
    //Fist get all users
    useEffect(() => {
        dispatch(getAllUsersThunk())
    }, [])
    //Is fetch === true show load indicator
    const onSearch = useSelector((state: Global_state_type) => {
        return state.search.onSearch
    })

    //onChange
    const onChangeHandler = (e: any) => {
        if (e.currentTarget.value.length > 0) {
            dispatch(searchUserPageByName(e.currentTarget.value))
        } else {
            dispatch(getAllUsersThunk())
        }

    }
    //Redirrect to the specific user
    const setCurrentUserPage = (userID: string) => {
        navigate("/profile/id=" + userID)
    }


    return (
        <section className={styles.searchWrapper}>
            <input type="text" placeholder="find users" onChange={onChangeHandler}></input>
            <section className={styles.searchResults}>
                {!onSearch ? users?.map((user) => {
                    return (
                        <div className={styles.userMiniPage} key={user.userID} onClick={() => {
                            setCurrentUserPage(user.userID)
                        }}>
                            <img className={styles.avatar} src={user.avatar ? user.avatar : "#"} alt="#"></img>
                            <span>{user.fullName}</span>
                           
                        </div>
                    )

                }) : <LineLoader/>}
     
            </section>

        </section >
    )

})