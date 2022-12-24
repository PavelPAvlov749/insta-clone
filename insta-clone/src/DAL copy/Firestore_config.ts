import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, addDoc } from "firebase/firestore";
import { getDatabase, ref, onValue, set, get, child } from "firebase/database";
import { firebase } from "./FirebaseConfig";
import { firebaseConfig } from "./FirebaseConfig";
import { useDispatch } from "react-redux";
import { async } from "@firebase/util";
import { Firestore } from "./FirebaseConfig";





//Initialize Real-time data base instance 
const dataBase = getDatabase();

export const writeUserData = async function () {
    const refrence = await ref(dataBase);
    onValue(refrence, (snap) => {
        const data = snap.val();
    })
}
//APPLICATION FIRESTORE INSTANSE
const reference = ref(dataBase)
export const Firestore_instance = {
    Get_collection: async()=>{
        let data;
        onValue(reference, (_snap) => {
            const data = _snap.val()
            return data
        })
    },
    Get_collection_once: async () => {
        const q = query(collection(Firestore, "chat_firestore"));
        const query_snapshot = await getDocs(q).then((data) => data)
        let data: any = []
        query_snapshot.forEach((doc) => {
            data.push(doc.data())
        })

        return data
    },
    get_posts: async () => {
        const q = query(collection(Firestore, "posts"));
        const query_snapshot = await getDocs(q).then((data) => data);
        let posts: any = [];
        query_snapshot.forEach((doc) => {
            posts.push({...doc.data(),id: doc.id})
        })
        return posts
    },
    add_post: async (text: string, img: string) => {
        const q = query(collection(Firestore, "posts"));
        await addDoc(collection(Firestore, "posts"), {
            post_img : img,
            post_likes_count : 0,
            post_text : text,
            userName : "Pavel Pavlov",
            user_id : "none"

        })
    },
    send_message : async (_text:string | undefined,user_id:string | undefined | null,_sender:string | undefined|null) => {
        const q = query(collection(Firestore,"chat_firestore"));
        const docRef = await addDoc(collection(Firestore,"chat_firestore"),{
            message_text : _text,
            user_id : user_id,
            created_at : new Date().getUTCDate(),
            sender : _sender
        })
    }
}
