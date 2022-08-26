import React from "react";
import { useSelector } from "react-redux";
import { Global_state_type } from "../../Redux/Store";
import { ComentType } from "../../Redux/Types";


export const PostComent: React.FC = React.memo((props) => {
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
                    <div>
                        <span>{coment.coment_text}</span>
                        <br />
                    </div>


                )
            }) : null}
        </section>

    )
})