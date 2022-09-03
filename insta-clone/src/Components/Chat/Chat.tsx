import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatAPI } from "../../DAL/ChatAPI";
import { getChatsByUserID } from "../../Redux/ChatReducer";
import { Global_state_type } from "../../Redux/Store";
import { ChatType } from "../../Redux/Types";
import { ChatList } from "./ChatList";
import { ChatWindow } from "./ChatWindow";

export const Chat : React.FC = React.memo((props) => {

 
    return (
        <section>
            <ChatList/>
            <ChatWindow/>
        </section>
    )
})