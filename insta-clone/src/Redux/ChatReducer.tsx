import { ThunkAction } from "redux-thunk";
import { Global_state_type, InferActionType } from "./Store";
import { Firestore_instance } from "../DAL/Firestore_config";
import {child, get, onValue, ref} from "firebase/database"
import { ChatType, MessageType, UserType } from "./Types";
import { app_actions } from "./AppReducer";
import { chatAPI } from "../DAL/ChatAPI";
import { send } from "process";
import { dataBase } from "../DAL/FirebaseConfig";
import { disableNetwork } from "firebase/firestore";
import { usersAPI } from "../DAL/UsersAPI";
import { hasPointerEvents } from "@testing-library/user-event/dist/utils";

const SEND_MESSAGE = "instaClone/chat_reducer/send_message"
const GET_MESSAGES = "instaClone/chatReducer/get_messages"
const GET_CHATS = "instaClone/chatReducer/getChats"
const SET_ACTIVE_CHATS = "instaClone/chatReducer/setActiveChat"
const SET_NEW_MESSAGE = "instaClone/chatReducer/setNewMessage"
const GET_INTERLOCUTOR_AVATAR = "insta-clone/chatReducer/getAvatar"

type ActionType = InferActionType<typeof chat_actions>
type Thunk_type = ThunkAction<void,Global_state_type,unknown,ActionType>

let initialState = {
    activeChat : null as unknown as ChatType,
    chats : [] as Array<UserType>,
    messages : [] as Array<MessageType>,
    newMessage : "",
    interlocutorAvatar : null as unknown as string

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
                activeChat : {...action.payload}
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
        case SET_NEW_MESSAGE : {
            return {
                ...state,
                newMessage : action.payload
            }
        }
        case GET_INTERLOCUTOR_AVATAR : {
            return {
                ...state,
                interlocutorAvatar : action.payload
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
    setActiveChat : (userID : string,avatar : string,fullName:string) => ({
        type : "instaClone/chatReducer/setActiveChat",
        payload : {
            userID : userID,
            avatar : avatar,
            fullName : fullName
        }
    } as const),
    getMessages : (messages : Array<MessageType>) => ({
        type : "instaClone/chatReducer/get_messages",
        payload : messages
    } as const),
    sendMEssage : (message : MessageType) => ({
        type : "instaClone/chat_reducer/send_message",
        payload : message
    } as const ),
    setNewMessage : (newMessage : string) => ({
        type : "instaClone/chatReducer/setNewMessage",
        payload : newMessage
    } as const ),
    getAvatar : (avatar : string ) => ({
        type : "insta-clone/chatReducer/getAvatar",
        payload : avatar
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
export const getRoomByUserID = (currentUserID : string,userID:string) => {
    return async function (dispatch : any) {
        const room = await chatAPI.getRoom(currentUserID,userID)
       
        // if(room){
        //     dispatch(chat_actions.setActiveChat(room))
        // }else{
        //     dispatch(chat_actions.setActiveChat(room))
        // }
        
    }
}
export const getMessagesByChatID = (currentUserID:string,chatID : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())

        let messages = await chatAPI.getMessages(chatID)
            if(messages.length){
                dispatch(chat_actions.getMessages(messages as Array<MessageType>))
                dispatch(app_actions.set_is_fetch_fasle())
        
            }

       


    }
}

export const getRealtimeMessages = (currentUserID:string,userID:string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        let Ref = await (await get(child(ref(dataBase), "Users/" + currentUserID + '/chats/' + userID))).val()
        console.log(Ref)
        let messages: Array<any> = []
            console.log(currentUserID)
            console.log(userID)
            if(Ref){
                const roomRef = ref(dataBase, "Chats/" + Ref.chatRef)
                onValue(roomRef, (roomSnapSchot) => {
                    messages = Object.values(roomSnapSchot.val())
                    dispatch(chat_actions.getMessages(messages))
                    dispatch(app_actions.set_is_fetch_fasle())
                    console.log(messages)
                })
            }else{
                dispatch(chat_actions.getMessages([]))
                dispatch(app_actions.set_is_fetch_fasle())
                console.log("sdfsdf")
            }

    }
}
export const sendMessageThunk = (sender: string, recepient: string, messageText: string,senderName: string) => {
    return async function (dispatch : any){
        dispatch(app_actions.set_is_fetch_true())
        let newMessage = await chatAPI.sendMessage(sender,recepient,messageText,senderName)
        dispatch(chat_actions.sendMEssage({
            messageData : messageText,
            fullName : senderName,
            userID : sender,
            createdAt : new Date()
        }))
        dispatch(app_actions.set_is_fetch_fasle())
    }
}

export const getInterlocutorAvatar = (interlocutorID : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        const avatar = await usersAPI.getAvatar(interlocutorID)
        if(avatar){
            dispatch(chat_actions.getAvatar(avatar))
            dispatch(app_actions.set_is_fetch_fasle())
        }else{
            dispatch(chat_actions.getAvatar(null as unknown as string))
            dispatch(app_actions.set_is_fetch_fasle())
        }
    }
}