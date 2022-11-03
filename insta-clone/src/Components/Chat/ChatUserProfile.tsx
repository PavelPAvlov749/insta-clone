import React from "react";
import { useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";


export const UserPageMini : React.FC = React.memo((props) => {
    const recepiuentPage = useSelector((state : Global_state_type) => {
        return state
    })
    return (
        <section>
       
        </section>
    )
})