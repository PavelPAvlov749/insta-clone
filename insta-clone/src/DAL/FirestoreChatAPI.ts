import { addDoc, arrayUnion, collection, doc, DocumentReference, FieldValue, getDoc, 
    getDocs, increment, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { compose } from "redux";
import { chatReducer } from "../Redux/ChatReducer";

import { FirestoreAPI } from "./Firestore";

class firestoreChatAPI extends FirestoreAPI {
    constructor() {
        super()
    }


    async sendMessageToUser(senderID: string, senderName: string, messageText: string, recepientID: string, recepient: string, senderAvatar: string, recepientAvatar: string) {
        try {

            //Get refrence and document of user
            const userRef = await doc(this.fireStore, "Users", senderID)
            const userDoc = await getDoc(userRef)
            //Write userDoc chats array into the chat variable
            const chats: Array<any> = userDoc.data()?.chats
            //Then try to find current chat if chat already exist chatId will be an object with firlds (id ,room id)
            //Anotherwise it will be ubdefined 
            let chatID: { id: string, roomID: string } = chats.find((el) => el.id === recepientID)
            console.log(chatID)
            //Check if chat exist
            if (chatID) {
                const roomRwef = await doc(this.fireStore, "Chats", chatID.roomID)
                const roomDoc = await getDoc(roomRwef)
                const newMessageRef = await collection(this.fireStore, "Messages")
                const mesageDoc = await doc(newMessageRef)
                //Create new message object
                let messageData = {
                    messageText: messageText,
                    creator: senderName,
                    creatorID: senderID,
                    roomID: chatID.roomID,
                    status: "unreaded",
                    timeStamp: serverTimestamp(),
                    attachments: null,
                    recepientID: recepientID,
                    recepientFullName: recepient
                }
                await setDoc(mesageDoc, { ...messageData, roomID: chatID.roomID })
                await updateDoc(roomRwef,{lastMessage : messageText})
                await this.incrementUnreadedMessagesCount(chatID.roomID)
                await this.incrementMessagesCount(chatID.roomID)
            } else {
                const newRoomRef = await collection(this.fireStore, "Chats")
                //New room object
                const newRom = {
                    users: [senderID, recepientID],
                    avatars: [{userID : senderID,avatar : senderAvatar},{userID : recepientID,avatar : recepientAvatar}],
                    lastMessage: messageText,
                    unreadedMessages: 0,
                    senderFullName: senderName,
                    recepientFullNAme: recepient
                }
                //Adding new room document into Db
                const room = await addDoc(newRoomRef, newRom)

                const senderRef = await doc(this.fireStore, "Users", senderID)
                const recepientRef = await doc(this.fireStore, "Users", recepientID)
           
                await updateDoc(senderRef, { chats: arrayUnion({ id: recepientID, roomID: room.id }) })
                await updateDoc(recepientRef, { chats: arrayUnion({ id: senderID, roomID: room.id }) })
                const newMessageRef = await collection(this.fireStore, "Messages")
                const mesageDoc = await doc(newMessageRef)
                //Create new message object
                let messageData  = {
                    messageText: messageText,
                    creator: senderName,
                    creatorID: senderID,
                    roomID: room.id,
                    status: "unreaded",
                    timeStamp: serverTimestamp(),
                    attachments: null,
                    recepientID: recepientID,
                    recepientFullName: recepient
                }
            
                await setDoc(mesageDoc, { ...messageData, roomID: room.id })
                await this.incrementUnreadedMessagesCount(room.id)
                await this.incrementMessagesCount(room.id)
                return messageData
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    async sendMesage(senderID: string, senderName: string, messageText: string, recepientID: string, recepient: string, senderAvatar: string, recepientAvatar: string) {
        try {
            const roomRef = await query(collection(this.fireStore, "Chats/"), where("users", "array-contains-any", [senderID, recepientID]))
            const roomDoc = await getDocs(roomRef)
            console.log(roomDoc.docChanges())
            roomDoc.forEach((el) => console.log(el.data()))
            console.log(roomDoc.empty)
            //New message object
            let messageData = {
                messageText: messageText,
                creator: senderName,
                creatorID: senderID,
                roomID: roomDoc.docChanges()[0].doc.id,
                status: "unreaded",
                timeStamp: serverTimestamp(),
                attachments: null,
                recepientID: recepientID,
                recepientFullName: recepient
            }
            if (!roomDoc.empty) {
                //If chat room alrady exist just oush new message object in messages firestore collection

                //Get DocRef 
                const messageRef = await collection(this.fireStore, "Messages/")
                //Push new Message
                const messageDoc: any = await doc(messageRef)
                await setDoc(messageDoc, { ...messageData, messageID: messageDoc.id })
                const roomRef = await doc(this.fireStore, "Chats", roomDoc.docChanges()[0].doc.id)
                await updateDoc(roomRef, { lastMessage: messageText })
                await this.incrementMessagesCount(roomDoc.docChanges()[0].doc.id)
                await this.incrementUnreadedMessagesCount(roomDoc.docChanges()[0].doc.id)
            } else {

                // Anotherwise Create new Chat Room
                const newRoomRef = await collection(this.fireStore, "Chats")
                const newRoomID = await doc(newRoomRef)

                //Chat room object
                const newRoom = {
                    users: [senderID, recepientID],
                    unreadedMessages: 1,
                    roomID: newRoomID.id,
                    messagesCount: 1,
                    lastMessage: messageText,
                    recepientAvatar: recepientAvatar,
                    senderAvatar: recepientAvatar,
                    senderFullName: senderName,
                    recepientFullNAme: recepient
                }
                //set new doc in collection
                await setDoc(newRoomID, newRoom)
                const newMessageRef = await collection(this.fireStore, "Messages")
                const mesageDoc = await doc(newMessageRef)
                await setDoc(mesageDoc, { ...messageData, roomID: newRoomID.id })

            }

        } catch (ex) {
            console.log(ex)
        }
    }
    //Increment messages count
    async incrementMessagesCount(roomID: string) {
        try {
            //Get the roomRef
            console.log(roomID)
            const roomRef = await doc(this.fireStore, "Chats", roomID)
            await updateDoc(roomRef, { messagesCount: await increment(1) })
        } catch (ex) {
            console.log(ex)
        }
    }
    //Decrement unreaded messages count 
    async decrementUnreadedMessagesCount(roomID: string) {
        try {
            const roomRef = await doc(this.fireStore, "Chats", roomID)
            await updateDoc(roomRef, { unreadedMessages: increment(-1) })
        } catch (ex) {
            console.log(ex)
        }
    }
    //Increment unreaded messages count 
    async incrementUnreadedMessagesCount(roomID: string) {
        try {
            const roomRef = await doc(this.fireStore, "Chats/", roomID)
            await updateDoc(roomRef, { unreadedMessages: await increment(1) })
        } catch (ex) {
            console.log(ex)
        }
    }
    async getUserRoomsByUserID(userID: string) {
        try {
            //Get the refrence of collecttion 
            const roomsRef = await query(collection(this.fireStore, "Chats"), where("users", "array-contains", userID))
            let rooms: any[] = []
            //Get collection document
            const roomDocs = await getDocs(roomsRef)
            //Push all rooms from doc into rooms Array
            roomDocs.forEach((room) => rooms.push({...room.data(),roomID : room.id}))
            //Return rooms array from the function
            console.log(rooms)
            return rooms
        } catch (ex) {
            console.log(ex)
        }
    }
    async getMessagesRealtime (chatID : string) {
        try{
            const q = query(collection(this.fireStore,"Messages"),where("roomID","==",chatID))
            const messages : any = []
            await onSnapshot(q,(snap) => {
                snap.forEach((el) => {
                    messages.push(el.data())
                })
            })
            console.log(messages)
            return messages
        }catch(ex){
            console.log(ex)
        }
    }
    async getMessages(roomID: string) {
        try {
            console.log(roomID)
            const mesasgesRef = await query(collection(this.fireStore, "Messages"), where("roomID", "==", roomID))
            const messagesDoc = await getDocs(mesasgesRef)
            const messages: any[] = []
            messagesDoc.forEach((el) => messages.push(el.data()))
            console.log(messagesDoc.docChanges())
            return messages
        } catch (ex) {
            console.log(ex)
        }
    }
}


export const firestoreChat = new firestoreChatAPI()