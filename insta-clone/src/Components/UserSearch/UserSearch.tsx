import { Formik ,Form,Field} from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Global_state_type } from "../../Redux/Store";
import { UserType } from "../../Redux/Types";
import { getUserPageByID } from "../../Redux/UserPageReducer";
import { getAllUsers } from "../../Redux/UsersSerarchReducer";


export const UserSearch : React.FC = React.memo((props) => {
    const navigate = useNavigate()
    const dispatch : any = useDispatch()

    useEffect(()=>{
        dispatch(getAllUsers())
    },[])

    const findedUsers = useSelector((state:Global_state_type) => {
        return state.search.userPages
    })
    
    const userNameToSearch = ""

    //Submit Foem handler function 
    const onSubmit = () => {
        
    }
    //Form Error Handler
    const onErrorHandler = () => {

    }
    const setCurrentUserPage = (userID : string) => {
        dispatch(getUserPageByID(userID))
        navigate("/profile/id=" + userID)
    }
    return (
        <section>
            <input type="text" placeholder="Search"></input>
            <div className="indicator" ></div>
            {/*................. Bellow should map function in findedUsers variable .... */}
            {findedUsers.length > 0 ? findedUsers.map((user : UserType) => {
                return (
                    <div key={user.userID}>
                        <h3>{user.fullName}</h3>
                        <img src={user.avatar} alt="" onClick={() => {
                            setCurrentUserPage(user.userID)
                        }} />
                    </div>
                )
            }): <h1>No Results!</h1>}
        </section>
    )
})