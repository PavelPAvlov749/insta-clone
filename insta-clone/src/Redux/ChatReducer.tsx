
import { InferActionType } from "./Store";
import { onValue, ref} from "firebase/database"
import {  ChatType, MessageType, newChatType, UserType } from "./Types";
import { app_actions } from "./AppReducer";
import { chatAPI } from "../DAL/ChatAPI";
import { dataBase } from "../DAL/FirebaseConfig";
import { usersAPI } from "../DAL/UsersAPI";



const SEND_MESSAGE = "instaClone/chat_reducer/send_message"
const GET_MESSAGES = "instaClone/chatReducer/get_messages"
const GET_CHATS = "instaClone/chatReducer/getChats"
const SET_ACTIVE_CHATS = "instaClone/chatReducer/setActiveChat"
const SET_NEW_MESSAGE = "instaClone/chatReducer/setNewMessage"
const GET_INTERLOCUTOR_AVATAR = "insta-clone/chatReducer/getAvatar"


type ActionType = InferActionType<typeof chat_actions>

let initialState = {
    activeChat : null as unknown as string,
    chats : [] as Array<UserType>,
    messages : [] as Array<any>,
    newMessage : "",
    interlocutorAvatar : null as unknown as string,
    unreadedMessages : null as unknown as number

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
    setActiveChat : (roomID :string) => ({
        type : "instaClone/chatReducer/setActiveChat",
        payload : roomID
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
        const chats = await chatAPI.getListOfChatsByUserID(userID)

        if(chats) {
            dispatch(chat_actions.getChats(Object.values(chats)))
            dispatch(app_actions.set_is_fetch_fasle())
        }else{
            
        }
    }
}
export const getRoomByUserID = (currentUserID : string,userID:string) => {
    return async function (dispatch : any) {
        const room = await chatAPI.getRoom(currentUserID,userID)
        if(room){
            dispatch(chat_actions.setActiveChat(room))
        }else{
            dispatch(chat_actions.setActiveChat(""))
        }
    }
}
export const getMessagesByChatID = (chatID : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())

        let messages = await chatAPI.getMessages(chatID)
            if(messages.length){
                dispatch(chat_actions.getMessages(messages as Array<MessageType>))
                dispatch(app_actions.set_is_fetch_fasle())
        
            }
    }
}

export const getRealtimeMessages = (chatID : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        try{
            const chatRef = await ref(dataBase,"Messages/" + chatID)
            onValue(chatRef,(dataSnapshot) => { 
                if(dataSnapshot.exists()) {
                    dispatch(chat_actions.getMessages(Object.values(dataSnapshot.val())))
                    dispatch(app_actions.set_is_fetch_fasle())
                }else{
                    dispatch(chat_actions.getMessages([]))
                    dispatch(app_actions.set_is_fetch_fasle())
                }
            })
        }catch(ex){
            console.log(ex)
        }
    }
}
export const sendMessageFromModalWindow = (newChat : newChatType,messageText : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        let chatList : Array<any> = Object.values( await chatAPI.getListOfChatsByUserID(newChat.sender.senderID))
      
        if(chatList.find((chat : any) => chat.userID === newChat.recepient.recepientID)){
            await chatAPI.sendMessage(newChat.sender.senderID,newChat.sender.senderFullName,messageText,chatList[0].chatID as string)
        }else{
            const newChatID = await chatAPI.createNewChat({...newChat})
            await chatAPI.sendMessage(newChat.sender.senderID,newChat.sender.senderFullName,messageText,newChatID as string)
        }

    }
}
export const sendMessageThunk = (sender: string, senderName : string,messageText : string,chatID : string) => {
    return async function (dispatch : any){
        console.log(chatID)
        dispatch(app_actions.set_is_fetch_true())
        await chatAPI.sendMessage(sender,senderName,messageText,chatID)
        dispatch(app_actions.set_is_fetch_fasle())
    }
}

export const createNewChat = (newChat : newChatType,messageText? : string) => {
    return async function (dispatch : any) {
        dispatch(app_actions.set_is_fetch_true())
        const newChatID =  await chatAPI.createNewChat(newChat)
        const message = await chatAPI.sendMessage(newChat.sender.senderID,newChat.sender.senderFullName,messageText as string,newChatID as string)
        dispatch(chat_actions.setActiveChat(newChatID as string))
        dispatch(app_actions.set_is_fetch_fasle())
    }
}