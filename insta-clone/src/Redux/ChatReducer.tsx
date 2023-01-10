
import { InferActionType } from "./Store";
import { getDatabase, onValue, ref } from "firebase/database"
import { chatRoomType, ChatType, MessageType, newChatType, UserType } from "./Types";
import { app_actions } from "./AppReducer";
import { dataBase, firebaseConfig } from "../DAL/FirebaseConfig";
import { firestoreChat } from "../DAL/FirestoreChatAPI";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, where, query, onSnapshot, orderBy, limit } from "firebase/firestore";






const SEND_MESSAGE = "instaClone/chat_reducer/send_message"
const GET_MESSAGES = "instaClone/chatReducer/get_messages"
const GET_CHATS = "instaClone/chatReducer/getChats"
const SET_ACTIVE_CHATS = "instaClone/chatReducer/setActiveChat"
const SET_NEW_MESSAGE = "instaClone/chatReducer/setNewMessage"
const GET_INTERLOCUTOR_AVATAR = "insta-clone/chatReducer/getAvatar"



type ActionType = InferActionType<typeof chat_actions>

let initialState = {
    activeChat: null as unknown as chatRoomType,
    chats: [] as Array<chatRoomType>,
    messages: [] as Array<MessageType>,
    newMessage: "",
    interlocutorAvatar: null as unknown as string,
    unreadedMessages: null as unknown as number

}

export const chatReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        case GET_CHATS: {
            return {
                ...state,
                chats: [...action.payload]
            }
        }
        case SET_ACTIVE_CHATS: {
            return {
                ...state,
                activeChat: action.payload
            }
        }
        case GET_MESSAGES: {
            return {
                ...state,
                messages: action.payload
            }
        }
        case SEND_MESSAGE: {
            return {
                ...state,
                messages: state.messages.concat(action.payload)
            }
        }
        case SET_NEW_MESSAGE: {
            return {
                ...state,
                newMessage: action.payload
            }
        }
        case GET_INTERLOCUTOR_AVATAR: {
            return {
                ...state,
                interlocutorAvatar: action.payload
            }
        }
        default:
            return state
    }
};

export const chat_actions = {
    getChats: (chats: any) => ({
        type: "instaClone/chatReducer/getChats",
        payload: chats
    } as const),
    setActiveChat: (room: chatRoomType) => ({
        type: "instaClone/chatReducer/setActiveChat",
        payload: room
    } as const),
    getMessages: (messages: Array<MessageType>) => ({
        type: "instaClone/chatReducer/get_messages",
        payload: messages
    } as const),
    sendMEssage: (message: MessageType) => ({
        type: "instaClone/chat_reducer/send_message",
        payload: message
    } as const),
    setNewMessage: (newMessage: string) => ({
        type: "instaClone/chatReducer/setNewMessage",
        payload: newMessage
    } as const),
    getAvatar: (avatar: string) => ({
        type: "insta-clone/chatReducer/getAvatar",
        payload: avatar
    } as const)
}



export const getChatsByUserID = (userID: string) => {
    return async function (dispatch: any) {
        dispatch(app_actions.set_is_fetch_true())
        const chats = await firestoreChat.getUserRoomsByUserID(userID)
        if (chats) {
            dispatch(chat_actions.getChats(Object.values(chats)))
            dispatch(app_actions.set_is_fetch_fasle())
        } else {

        }
    }
}



export const getRealtimeMessages = (chatID: string) => {
    return async function (dispatch: any) {
        dispatch(app_actions.set_is_fetch_true())
        try {
            let app = await initializeApp(firebaseConfig)
            let db = await getFirestore(app)
            let q = await query(collection(db, "Messages"), where("roomID", "==", chatID),limit(100))
            let messages: MessageType[] = []
            await onSnapshot(q, (snap) => {
                snap.forEach((message) => {
                    messages.push(message.data() as MessageType)
                    dispatch(chat_actions.getMessages(messages))
                })

            })
            dispatch(app_actions.set_is_fetch_fasle())
        } catch (ex) {
            console.log(ex)
        }
    }
}

export const sendMessageFromModalWindow = (newChat: newChatType, messageText: string) => {
    return async function (dispatch: any) {
        dispatch(app_actions.set_is_fetch_true())
        await firestoreChat.sendMessageToUser(newChat.sender.senderID, newChat.sender.senderFullName, messageText, newChat.recepient.recepientID,
            newChat.recepient.recepientFullName, newChat.sender.avatar as string, newChat.recepient.avatar as string)
        dispatch(app_actions.set_is_fetch_fasle())
    }
}

export const sendMessageThunk = (senderID: string, senderName: string, messageText: string, chatID: string, recepientID: string, recepientFullName: string,
    senderAvatar: string, recepientAvatar: string) => {
    return async function (dispatch: any) {
        console.log(chatID)
        dispatch(app_actions.set_is_fetch_true())
        const newMessage: MessageType | undefined = await firestoreChat.sendMessageToUser(senderID, senderName, messageText, recepientID, recepientFullName, senderAvatar, recepientAvatar)
        if (newMessage) {
            dispatch(chat_actions.sendMEssage(newMessage as MessageType))
        }

        dispatch(app_actions.set_is_fetch_fasle())
    }
}

