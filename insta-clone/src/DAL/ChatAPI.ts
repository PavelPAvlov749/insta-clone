import { isEditable } from "@testing-library/user-event/dist/utils";
import { child, DatabaseReference, equalTo, get, orderByChild, push, query, update } from "firebase/database";
import { ChatType, MessageType } from "../Redux/Types";
import { abstractAPI } from "./PostApi";
import { makeid } from "./Randomizer";

class ChatAPI extends abstractAPI {
    constructor() {
        super()
    }
    async sendMessage(senderID: string, recepientID: string, messageText: string, senderName: string,) {

        let newMessage: MessageType = {
            messageData: messageText,
            createdAt: new Date(),
            userID: senderID,
            fullName: senderName
        }
        const roomRef = await (await get(child(this.DatabaseRef, "Users/" + senderID + "/chats/" + recepientID))).val()
        if (roomRef) {
            const newMessageKey = push(child(this.ref(this.RealtimeDataBase), "Chats/" + roomRef.chatRef + "/")).key
            const updates: any = {}
            updates["Chats/" + roomRef.chatRef + "/" + newMessageKey] = newMessage
            update(this.ref(this.RealtimeDataBase), updates)
        } else {
            const newRoomID = makeid(15)
            const newMessageKey =  push(child(this.ref(this.RealtimeDataBase), "Chats/" + newRoomID)).key
            let recepientChatRoomRef = { chatRef: newRoomID}
            let senderChatRoomRef = { chatRef: newRoomID}
            const updates : any = {}

            updates["Users/" + recepientID + "/chats/" + senderID] = recepientChatRoomRef
            updates["Users/" + senderID + "/chats/" + recepientID] = senderChatRoomRef
            updates["Chats/" + newRoomID + "/" + newMessageKey] = newMessage;
            update(this.ref(this.RealtimeDataBase), updates)

        }

    }
    async getRoom(currentUserID: string, userID: string) {
        const room = await (await get(child(this.DatabaseRef, "Users/" + currentUserID + "/chats/" + userID))).val()
        if (room) {
            console.log(room.chatRef)
            return room.chatRef
        } else {
            return null
        }
    }
    async getMessages(roomID: string) {
        const result = await (await get(child(this.DatabaseRef, "Chats/" + roomID))).val()
        console.log(roomID)
        console.log(result)
        const chat = Object.values(result)
        return chat
    }
    async getChatList(userID: string) {
        const result = await (await get(child(this.DatabaseRef, "Users/" + userID + "/chats/"))).val()
        const chatList = Object.values(result)
        return chatList
    }
    async isChatExist(senderID: string, roomID: string) {
        const room = await (await (get(child(this.DatabaseRef, "Users/" + senderID + "/chats/" + roomID)))).exists()
        if (room) {
            this.getMessages(roomID)
            return true
        } else {
            return false
        }
    }
    async getMessagesRealtime(currentUserID: string, roomID: string) {
        const ref = await (await get(child(this.DatabaseRef, "Users/" + currentUserID + '/chats/' + roomID))).val()
        
        let messages: Array<any> = []
        if(ref){
            const roomRef = this.ref(this.RealtimeDataBase, "Chats/" + ref.chatRef)
            this.onValue(roomRef, (roomSnapSchot) => {
                messages = Object.values(roomSnapSchot.val())

            })
        }
        return messages
    }
}

export const chatAPI = new ChatAPI()