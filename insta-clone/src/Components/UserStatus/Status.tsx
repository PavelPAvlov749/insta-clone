import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth_actions } from "../../Redux/AuthReducer";
import { AccountActions, updateStatusThunk } from "../../Redux/ProfileReducer";
import { Global_state_type } from "../../Redux/Store";
import { userPageActions } from "../../Redux/UserPageReducer";







export const UserStatus: React.FC<{status : string,userID : string,setNewStatus : (userID:string,status:string)=>void}> = (props) => {
    const dispatch : any = useDispatch()
    const status = useSelector((state: Global_state_type) => {
        return state.userPage.status 
    })
    const currentUserID = useSelector((state : Global_state_type) => {
        return state.account.userID
    })
    let [edit_mode, set_edit_mode] = useState(false);

    const activate_edit_mode = () => {
        set_edit_mode(true)
    }
    const deactivate_edit_mode = () => {
        set_edit_mode(false)
        dispatch(updateStatusThunk(currentUserID as string,status as string))
    }

    const on_status_change = (e: any) => {
        dispatch(userPageActions.updateStatus(e.currentTarget.value))
        console.log(status)
    }


    return (
        <>
            {!edit_mode ? <span style={{ "fontWeight": "400", "fontSize": "20px", "width": "100px" }} onClick={activate_edit_mode} >{props.status}</span> :
                <div>
                    <input type="text" title="Edit" value={status as string} onChange={on_status_change} onBlur={deactivate_edit_mode} autoFocus={true}></input>
                </div>

            }
        </>
    )
}