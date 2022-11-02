import { child, DatabaseReference, DataSnapshot, equalTo, get, orderByChild, push, query, runTransaction, update } from "firebase/database";
import { Message } from "../Components/Chat/Message";
import { ChatType, MessageType } from "../Redux/Types";
import { abstractAPI } from "./PostApi";
import { makeid } from "./Randomizer";

class ChatAPI extends abstractAPI {
    constructor() {
        super()
    }

    //INCREMENT UNREADED MESSAGES COUNT ::::::::::::
    
    async incrementUnreadedMessagesCount (userID: string) {
        const countRef = await this.ref(this.RealtimeDataBase,"Users/" + userID + '/' + "unreadedMessages")
        try{
            await runTransaction(countRef,(unreadedMessages : number) => {
                if(unreadedMessages){
                    unreadedMessages++
                    console.log(unreadedMessages)
                }else{
                    // const data = 1
                    // const updates : any = {}
                    // updates["Users/" + userID + "/unreadedMessages/"] = data
                    // update(this.ref(this.RealtimeDataBase),updates)
                }
                return unreadedMessages 
            })
        }catch(ex ){
            console.log("CANT INCREMENT : " + ex)
        }

    }

    //DECREMENT UNEADED MESSAGES COUNT ::::::::::::: 
    async decrementUnreadedMessagesCount (userID : string){
        const countRef = this.ref(this.RealtimeDataBase,"Users/" + userID + '/' + "unreadedMessages")
        runTransaction(countRef,(messagesCount : number) => {
            if(messagesCount){
                messagesCount--
            }
            return messagesCount
        })
    }

    //SEND MESSAGE ::::::::::::::

    async sendMessage(senderID: string, recepientID: string, messageText: string, senderName: string,) {

        let newMessage: MessageType = {
            messageData: messageText,
            createdAt: new Date(),
            userID: senderID,
            fullName: senderName,
            messageStatus: "unreaded"
        }
        const roomRef = await (await get(child(this.DatabaseRef, "Users/" + senderID + "/chats/" + recepientID))).val()
        if (roomRef) {
            const newMessageKey = push(child(this.ref(this.RealtimeDataBase), "Chats/" + roomRef.chatRef + "/")).key
            let newMessage: MessageType = {
                messageData: messageText,
                createdAt: new Date(),
                userID: senderID,
                fullName: senderName,
                messageStatus: "unreaded",
                messageID : newMessageKey
            }
            const updates: any = {}
            updates["Chats/" + roomRef.chatRef + "/" + newMessageKey] = newMessage
            update(this.ref(this.RealtimeDataBase), updates)
        } else {
            const newRoomID = makeid(15)
            const newMessageKey = push(child(this.ref(this.RealtimeDataBase), "Chats/" + newRoomID)).key
            let recepientChatRoomRef = { chatRef: newRoomID }
            let senderChatRoomRef = { chatRef: newRoomID }
            const updates: any = {}
            updates["Users/" + recepientID + "/chats/" + senderID] = recepientChatRoomRef
            updates["Users/" + senderID + "/chats/" + recepientID] = senderChatRoomRef
            updates["Chats/" + newRoomID + "/" + newMessageKey] = newMessage;
            update(this.ref(this.RealtimeDataBase), updates)

        }
    
    }

    //GET ROOM ::::::::::::::::

    async getRoom(currentUserID: string, userID: string) {

        return await (await get(child(this.DatabaseRef, "Users/" + currentUserID + "/chats/" + userID))).val().chatRef


    }

    //GET MESSAGES ::::::::::::::::

    async getMessages(roomID: string) {
        const result = await (await get(child(this.DatabaseRef, "Chats/" + roomID))).val()
        const chat = Object.values(result)
        console.log(chat)

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

    async switchMessageStatus(roomID:string,messageID : string) {
        const ref = await (await get(child(this.DatabaseRef,"Chats/" + roomID + "/" + messageID)))
     
        console.log(ref.val())
        let messageData = {
            messageData: ref.val().messageData,
            createdAt: ref.val().createdAt,
            userID: ref.val().userID,
            fullName: ref.val().fullName,
            messageStatus: "readed",
            messageID : messageID
        }
        const updates : any = {}
        updates["Chats/" + roomID + "/" + messageID] = messageData;
        update(this.ref(this.RealtimeDataBase), updates)
    }

    //GET MESSAGES REALTIME :::::::::::::::

    async getMessagesRealtime(currentUserID: string, roomID: string) {
        const ref = await (await get(child(this.DatabaseRef, "Users/" + currentUserID + '/chats/' + roomID))).val()
        let messages: Array<MessageType> = []
        if (ref) {
            const roomRef = this.ref(this.RealtimeDataBase, "Chats/" + ref.chatRef)
            this.onValue(roomRef, (roomSnapSchot: DataSnapshot) => {
                messages = Object.values(roomSnapSchot.val())
                debugger
                console.log(messages[messages.length])

            })
        }
    
        return messages
    }
}

export const chatAPI = new ChatAPI()