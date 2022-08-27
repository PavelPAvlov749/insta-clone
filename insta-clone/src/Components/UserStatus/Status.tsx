import React, { useEffect, useState } from "react";






export const UserStatus: React.FC<{status : string,userID : string,setNewStatus : (userID:string,status:string)=>void}> = (props) => {
    let [edit_mode, set_edit_mode] = useState(false);
    let [status, set_status] = useState(props.status);
    useEffect(() => {
        set_status(props.status)
    }, [props.status])

    const activate_edit_mode = () => {
        set_edit_mode(true)
    }
    const deactivate_edit_mode = () => {
        set_edit_mode(false)
        props.setNewStatus(props.userID,status)
    }

    const on_status_change = (e: any) => {
        set_status(e.currentTarget.value)
    }


    return (
        <>
            {!edit_mode ? <span style={{ "fontWeight": "400", "fontSize": "20px", "width": "100px" }} onClick={activate_edit_mode} >{props.status}</span> :
                <div>
                    <input type="text" title="Edit" value={status} onChange={on_status_change} onBlur={deactivate_edit_mode} autoFocus={true}></input>
                </div>

            }
        </>
    )
}