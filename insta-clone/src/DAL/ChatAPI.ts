import { timeStamp } from "console";
import { child, DatabaseReference, DataSnapshot, equalTo, ref, get, orderByChild, push, query, runTransaction, update, orderByValue, orderByKey, startAt, endAt } from "firebase/database";
import { Message } from "../Components/Chat/Message";
import { ChatType, MessageType, newChatType, MessagePropsType, newMessagePropsType } from "../Redux/Types";
import { abstractAPI } from "./PostApi";
import { makeid } from "./Randomizer";
class ChatAPI extends abstractAPI {
    constructor() {
        super()
    }

    //INCREMENT UNREADED MESSAGES COUNT ::::::::::::

    async incrementUnreadedMessagesCount(senderID : string,chatID: string) {
        const countRef = await this.ref(this.RealtimeDataBase, "Chats/" + senderID + "/" + chatID + "/unreadedMessages")
        try {
            console.log(countRef)
            await runTransaction(countRef, (unreadedMessages: number) => {
                if (unreadedMessages) {
                    unreadedMessages++
                    console.log(unreadedMessages)
                } else {
                    // const data = 1
                    // const updates : any = {}
                    // updates["Users/" + userID + "/unreadedMessages/"] = data
                    // update(this.ref(this.RealtimeDataBase),updates)
                }
                return unreadedMessages
            })
        } catch (ex) {
            console.log("CANT INCREMENT : " + ex)
        }

    }

    //DECREMENT UNEADED MESSAGES COUNT ::::::::::::: 
    async decrementUnreadedMessagesCount(userID: string) {
        const countRef = this.ref(this.RealtimeDataBase, "Users/" + userID + '/' + "unreadedMessages")
        runTransaction(countRef, (messagesCount: number) => {
            if (messagesCount) {
                messagesCount--
            }
            return messagesCount
        })
    }

    //SEND MESSAGE ::::::::::::::

    async sendMessage(senderID: string, senderName: string, messageText: string, chatID: string) {
        const isChatExist = await (await get(child(this.DatabaseRef, "Chats/" + senderID + "/" + chatID))).exists()
        await this.incrementUnreadedMessagesCount(senderID, chatID)
        if (isChatExist) {
            const newMessageKey = push(child(this.ref(this.RealtimeDataBase), "Messages/" + chatID)).key
            let newMessage: newMessagePropsType = {
                messageText: messageText,
                senderID: senderID,
                senderFullName: senderName,
                messageStatus: "unreaded",
                messageID: newMessageKey as string,
                chatID: chatID
            }
            const updates: any = {}
            updates["Messages/" + chatID + "/" + newMessageKey] = newMessage
            update(this.ref(this.RealtimeDataBase), updates)
        }

    }

    //GET ROOM ::::::::::::::::

    async getRoom(currentUserID: string, userID: string) {

        const chatRef = await (await get(child(this.DatabaseRef, "Users/" + currentUserID + "/chats/" + userID))).val()
        if(chatRef){
            return chatRef.chatRef
        }else{
            return null
        }


    }

    //GET MESSAGES ::::::::::::::::

    async getMessages(chatID: string) {
        // const result = await (await get(child(this.DatabaseRef, "Chats/" + roomID))).val()
        let messages_ref: DatabaseReference = ref(this.RealtimeDataBase, "Messages/" + chatID);
        let messages = await get(query(messages_ref, orderByChild("chatID/"), equalTo(chatID)))
        console.log(chatID)
        console.log(messages.val())
        const chat = Object.values(messages.val())


        return chat
    }

    //GET CHAT LIST ::::::::::::::::

    async getChatList(userID: string) {
        const result = await (await get(child(this.DatabaseRef, "Users/" + userID + "/chats/"))).val()
        const chatList = Object.values(result)
        return chatList
    }

    //IS CHAT EXIST ::::::::::::::

    async isChatExist(senderID: string, roomID: string) {
        const room = await (await (get(child(this.DatabaseRef, "Users/" + senderID + "/chats/" + roomID)))).exists()
        if (room) {
            this.getMessages(roomID)
            return true
        } else {
            return false
        }
    }

    //SWITCH MESSAGE STATUS ::::::::::::::

    async switchMessageStatus(roomID: string, messageID: string) {
        const db_ref = await ref(this.RealtimeDataBase, "Messages/" + roomID)
        const message = await (await get(query(db_ref, orderByChild("messageID"), equalTo(messageID))))

        
        let messageData: newMessagePropsType = {
            messageText: message.val().messageText,
            createdAt: message.val().createdAt,
            senderID: message.val().userID,
            senderFullName: message.val().fullName,
            messageStatus: "readed",
            messageID: messageID,
            chatID: roomID
        }
        const updates: any = {}
        updates["Messages/" + roomID + "/" + messageID] = messageData;
        update(this.ref(this.RealtimeDataBase), updates)
    }

    async createNewChat(newChat: newChatType) {
        try {

            const roomRef = await push(child(this.ref(this.RealtimeDataBase), "Chats/" + newChat.sender.senderID)).key
            let membersData = {
                [newChat.sender.senderID]: true,
                [newChat.recepient.recepientID]: true

            }
            let senderChatData = {
                fullName: newChat.sender.senderFullName,
                userID: newChat.sender.senderID,
                lastMessage: null,
                chatID: roomRef,
                timestamp: new Date().toUTCString(),
                avatar: newChat.sender.avatar,
                unreadedMessages : 0
            }
            let recepientChatData = {
                fullName: newChat.recepient.recepientFullName,
                userID: newChat.recepient.recepientID,
                lastMessage: null,
                chatID: roomRef,
                timestamp: new Date().toUTCString(),
                avatar: newChat.recepient.avatar,
                unreadedMessages : 0
            }
            const updates: any = {}
            updates["Chats/" + newChat.sender.senderID + "/" + roomRef] = recepientChatData
            updates["Chats/" + newChat.recepient.recepientID + "/" + roomRef] = senderChatData
            updates["Members/" + roomRef] = membersData
            updates["Messages/" + roomRef] = {}

            await update(this.ref(this.RealtimeDataBase), updates)
            return roomRef
        } catch (ex) {
            console.log(ex)
        }
    }

    //GET SINGLE CHAT BY CHAT ID :::::::::::::::::

    async getChat(chatID: string) {
        try {
            const chatRef = await (await get(child(this.DatabaseRef, "Chats/" + chatID))).val()
            if (chatRef) {
                return chatRef
            } else {
                return null
            }
        } catch (ex) {
            console.log(ex)
        }

    }
    //GET ALL CURRENT USER CHATS BY USER ID :::::::::::::::::

    async getListOfChatsByUserID(userID: string) {
        try {
            let users_ref: DatabaseReference = ref(this.RealtimeDataBase, "Members/");
            let result = await get(child(this.DatabaseRef, "Chats/" + userID))
            console.log(result.val())
            if (result) {
                return result.val()
            } else {
                throw new Error("Cant fetch the chats")
            }
        } catch (ex) {
            console.log(ex)
        }


    }
}

export const chatAPI = new ChatAPI()