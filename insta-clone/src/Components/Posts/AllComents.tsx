import React from "react";
import { ComentType } from "../../Redux/Types";
import styles from "../../Styles/Coments.module.css"
import { SilngleComent } from "./Coments";
import { ComentTextArea } from "./ComentTextArea";
import backArrow from "../../Media/back.png"
import { useLocation, useNavigate } from "react-router-dom";

type AllComentsPropsType = {
    coment : Array<ComentType>,
    currentUserID : string 
}

export const AllComents : React.FC<AllComentsPropsType> = React.memo((props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const backArrowCloickHandler = () => {
        const backPath = location.pathname.split("/coments")[0]
        navigate(backPath)
    }
    return (
        <section  className={styles.comentWrapper}>
            <img src={backArrow} onClick={backArrowCloickHandler} alt="#"></img>
            <div className={styles.comentsList}>
            {props.coment.length > 0 ? props.coment.map((coment) => {
                return (
                    <>
                        <SilngleComent coment={coment} currentUserID={props.currentUserID}/>
                    </>
                )
            }) : <span className={styles.noComents}>There is no coments</span>}
            </div>
            <ComentTextArea/>
        </section>
    )
})