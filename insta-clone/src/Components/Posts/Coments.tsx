import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { deleteComentThunk, postActions } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import { ComentType } from "../../Redux/Types";
import styles from "../../Styles/Coments.module.css"
import crossIcon from "../../Media/delete_icon.png"
import { Avatar } from "../UserPage/Avatar";


export const SilngleComent: React.FC<{ coment: ComentType, currentUserID: string }> = React.memo((props) => {
    const dispatch: any = useDispatch()
    const location = useLocation().pathname.split("=")[1]
    const onDeleteHandler = () => {
        dispatch(deleteComentThunk(location, props.coment?.comentID as string))
    }

    return (
        <div key={props.coment?.comentID} className={styles.singleComentWrapper}>
            <Avatar size="small" fullName={props.coment?.comentatorName as string} avatarIMG={props.coment.avatar} />
            <span className={styles.userName}>{props.coment?.comentatorName + "\t:\t"}</span>
            <br />
            <span className={styles.comentText}>{props.coment?.coment_text}</span>
            <div className={styles.deleteWrapper}>
            {props.coment?.comentatorID === props.currentUserID ? <img className={styles.deleteComent} src={crossIcon} alt="#" onClick={onDeleteHandler}></img> : null}
            </div>
          
            <br />
        </div>

    )
})

export const PostComents: React.FC<{ coments: Array<ComentType> }> = React.memo((props) => {

    const currentUser = useSelector((state: Global_state_type) => {
        return state.account.userID
    })
    if (props.coments.length === 0) {
        return (
            <div>
                <span>No coments yet</span>
            </div>
        )
    } else {
        return (
            <section className={styles.comentsWrapper}>
                {props.coments.length > 0 ? props.coments.map((coment: ComentType) => {
                    return (
                        <SilngleComent coment={coment} currentUserID={currentUser as string} key={coment.comentID} />
                    )
                }) : null}
            </section>

        )
    }

})