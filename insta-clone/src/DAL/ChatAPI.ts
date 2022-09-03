import { isEditable } from "@testing-library/user-event/dist/utils";
import { child, equalTo, get, orderByChild, push, query, update } from "firebase/database";
import { ChatType, MessageType } from "../Redux/Types";
import { abstractAPI } from "./PostApi";

class ChatAPI extends abstractAPI {
    constructor() {
        super()
    }
    async sendMessage(senderID: string, recepientID: string, messageText: string, senderName: string,
        senderAvatar: string, recieverAvatar: string, recieverFullName: string, roomID: string) {

        //New message object
        let newMessage: MessageType = {
            messageData: messageText,
            createdAt: new Date(),
            userID: senderID,
            avatar: senderAvatar,
            fullName: senderName
        }
        let isRoomExist = await this.isChatExist(roomID)
        if (isRoomExist) {
            const newMessageKey = push(child(this.ref(this.RealtimeDataBase), "Chats" + roomID)).key
            const updates: any = {};
            updates["Chats/" + roomID + "/" + newMessageKey] = newMessage;
            update(this.ref(this.RealtimeDataBase), updates);
            console.log(true)
        } else {
            console.log(false)
            const newRoomKey = push(child(this.ref(this.RealtimeDataBase), "Chats" + roomID)).key
            const newMessageKey = push(child(this.ref(this.RealtimeDataBase), "Chats" + roomID)).key
            const updates: any = {};
            let recepientChatRoomRef = { chatRef: newRoomKey, fullName: senderName, avatar: senderAvatar }
            let senderChatRoomRef = { chatRef: newRoomKey, fullName: recieverFullName, avatar: recieverAvatar }
            updates["Users/" + recepientID + "/chats/" + senderID] = recepientChatRoomRef
            updates["Users/" + senderID + "/chats/" + recepientID] = senderChatRoomRef
            update(this.ref(this.RealtimeDataBase),updates)
            updates["Chats/" + roomID + "/" + newMessageKey] = newMessage;
            update(this.ref(this.RealtimeDataBase), updates);

        }
        // let recepientChatRoomRef = { chatRef : roomID,fullName : senderName,avatar : senderAvatar}
        // let senderChatRoomRef = {chatRef : roomID,fullName : senderName,avatar : recieverAvatar}
        // let data = newMessage
        // updates["Users/" + recepientID + "/chats/" + senderID] = recepientChatRoomRef
        // updates["Users/" + senderID + "/chats/" + recepientID] = senderChatRoomRef
        // update(this.ref(this.RealtimeDataBase), updates);
    }
    async getRoom(currentUserID: string, userID: string) {
        const room = await (await get(child(this.DatabaseRef, "Users/" + currentUserID + "/chats/" + userID))).val()
        if (room) {
            console.log(room)
            return room
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
    async isChatExist(roomID: string) {
        const room = await (await (get(child(this.DatabaseRef, "Chats/" + roomID)))).exists()
        if (room) {
            this.getMessages(roomID)
            return true
        } else {
            return false
        }
    }
}

export const chatAPI = new ChatAPI()