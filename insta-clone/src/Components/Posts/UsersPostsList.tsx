import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";



export const UserPostsList : React.FC = React.memo((props) => {
    const dispatch = useDispatch()
    const posts = useSelector((state:Global_state_type) => {
        return state.userPosts
    })
    useEffect(()=>{
        
    },[])
    return (
        <section>

        </section>
    )
})