import { ThunkAction } from "redux-thunk";
import { Global_state_type, InferActionType } from "./Store";
import { Firestore_instance } from "../DAL/Firestore_config";
import {get} from "firebase/database"
import { ChatType, MessageType, UserType } from "./Types";
import { app_actions } from "./AppReducer";
import { chatAPI } from "../DAL/ChatAPI";
import { send } from "process";

const SEND_MESSAGE = "instaClone/chat_reducer/send_message"
const GET_MESSAGES = "instaClone/chatReducer/get_messages"
const GET_CHATS = "instaClone/chatReducer/getChats"
const SET_ACTIVE_CHATS = "instaClone/chatReducer/setActiveChat"

type ActionType = InferActionType<typeof chat_actions>
type Thunk_type = ThunkAction<void,Global_state_type,unknown,ActionType>

let initialState = {
    activeChat : null as unknown as string,
    chats : [] as Array<UserType>,
    messages : [] as Array<MessageType>

}

export const chatReducer = (state = initialState,action:ActionType) => {
    switch(action.type){
        case GET_CHATS : {
            return {
                ...state,
                chats : [...action.payload]
            }
        }
        case SET_ACTIVE_CHATS : {
            return {
                ...state,
                activeChat : action.payload
            }
        }
        case GET_MESSAGES : {
            return {
                ...state,
                messages : action.payload
            }
        }
        case SEND_MESSAGE : {
            return {
                ...state,
                messages : state.messages.concat(action.payload)
            }
        }
        default : 
            return state
    }
};

export const chat_actions = {
    getChats : (chats :any) => ({
        type : "instaClone/chatReducer/getChats",
        payload : chats
    } as const),
    setActiveChat : (chatID : string) => ({
        type : "instaClone/chatReducer/setActiveChat",
        payload : chatID
    } as const),
    getMessages : (messages : Array<MessageType>) => ({
        type : "instaClone/chatReducer/get_messages",
        payload : messages
    } as const),
    sendMEssage : (message : MessageType) => ({
        type : "instaClone/chat_reducer/send_message",
        payload : message
    } as const )
}

export const getChatsByUserID = (userID:string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        const chats = await chatAPI.getChatList(userID)
        if(chats) {
            dispatch(chat_actions.getChats(chats))
            dispatch(app_actions.set_is_fetch_fasle())
            
        }
    }
}

export const getMessagesByChatID = (chatID : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        let messages = await chatAPI.getMessages(chatID)
        if(messages) {
            dispatch(chat_actions.getMessages(messages as Array<MessageType>))
            dispatch(app_actions.set_is_fetch_fasle())
        }
    }
}

export const sendMessageThunk = (sender: string, recepient: string, messageText: string,senderName: string,avatar : string,reciverAvatar : string,
    reciverFullName:string,roomID : string) => {
    return async function (dispatch : any){
        dispatch(app_actions.set_is_fetch_true())
        let newMessage = await chatAPI.sendMessage(sender,recepient,messageText,senderName,avatar,reciverAvatar,reciverFullName,roomID)
        dispatch(chat_actions.sendMEssage({
            messageData : messageText,
            avatar : avatar,
            fullName : senderName,
            userID : sender,
            createdAt : new Date()
        }))
        dispatch(app_actions.set_is_fetch_fasle())
    }
}