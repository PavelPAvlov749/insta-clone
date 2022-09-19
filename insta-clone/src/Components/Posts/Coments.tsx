import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { deleteComentThunk, postActions } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import { ComentType } from "../../Redux/Types";
import styles from "../../Styles/OpenPost.module.css"

const SilngleComent: React.FC<{coment : ComentType,currentUserID : string}> = React.memo((props) => {
    const dispatch : any = useDispatch()
    const location = useLocation().pathname.split("=")[1]
    const onDeleteHandler = () => {
        dispatch(deleteComentThunk(location,props.coment.comentID as string))
    }

    return (
        <div key={props.coment.comentID}>
            <img src={props.coment.avatar as string} alt="#" style={{"display" : "inline"}}/>
            <h1 style={{"display" : "inline"}}>{props.coment.comentatorName}</h1>
            {props.coment.comentatorID === props.currentUserID ?  <h5 style={{"color" : "red","display" : "inline"}} onClick={onDeleteHandler}>delete coment</h5> : null}
            <br />
            <span>{props.coment.coment_text}</span>
            <br />
        </div>

    )
})

export const PostComents: React.FC<{coments : Array<ComentType>}> = React.memo((props) => {
    
    const coments = useSelector((state : Global_state_type) => {
        return state.userPosts.currentPost.coments
    })
    const postID = useSelector((state:Global_state_type) => {
        return state.userPosts.currentPost.id
    })

    const currentUser = useSelector((state : Global_state_type) =>{
        return state.account.userID
    })
    if(props.coments.length === 0){
        return (
            <div>
                <span>No coments yet</span>
            </div>
        )
    }else{
        return (
            <section className={styles.comentsWrapper}>
                {props.coments.length > 0 ? props.coments.map((coment: ComentType) => {
                    return (
                        <SilngleComent coment={coment} currentUserID={currentUser as string} key={coment.comentID}/>
                    )
                }) : null}
            </section>
    
        )
    }

})