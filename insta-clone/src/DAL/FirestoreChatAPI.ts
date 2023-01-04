import { collection, getDoc, getDocs, query, where } from "firebase/firestore";

import { FirestoreAPI } from "./Firestore";

class firestoreChatAPI extends FirestoreAPI {
    constructor () {
        super()
    }
    async sendMesage (senderID: string, senderName: string, messageText: string, chatID: string,recepientID : string) {
        try{
            const roomRef = await query(collection(this.fireStore,"Chats"),where("users","array-contains-any",[senderID,recepientID],))
            const roomDoc = await getDocs(roomRef)
            roomDoc.forEach((el) => {
                console.log(el.data())
            })
        }catch(ex){
            console.log(ex)
        }
    }
}

export const  firestoreChat =  new firestoreChatAPI()