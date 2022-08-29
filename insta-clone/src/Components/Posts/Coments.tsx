import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postActions } from "../../Redux/PostReducer";
import { Global_state_type } from "../../Redux/Store";
import { ComentType } from "../../Redux/Types";


const SilngleComent: React.FC<{coment : ComentType}> = React.memo((props) => {
    const dispatch : any = useDispatch()
    const onDeleteHandler = () => {
        dispatch(postActions.deleteComent(props.coment.coment_text as string))
    }
    return (
        <div>
            <img src={props.coment.comentatorAvatar as string} alt="#" style={{"display" : "inline"}}/>
            <h1 style={{"display" : "inline"}}>{props.coment.comentatorName}</h1>
            <h5 style={{"color" : "red","display" : "inline"}} onClick={onDeleteHandler}>delete coment</h5>
            <br />
            <span>{props.coment.coment_text}</span>
            <br />
        </div>

    )
})

export const PostComents: React.FC = React.memo((props) => {
    const coments = useSelector((state: Global_state_type) => {
        return Object.values(state.userPosts.currentPost.coments)
    })
    console.log(coments)
    return (
        <section>
            <span>Coments :</span>
            <br />
            {coments.length > 0 ? coments.map((coment: ComentType) => {
                return (
                    <SilngleComent coment={coment}/>
                )
            }) : null}
        </section>

    )
})