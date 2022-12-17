import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { get, update } from "firebase/database";
import { getFirestore, addDoc, collection, getDoc, getDocs, doc, setDoc, query, orderBy, where, DocumentData, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { getStorage, ref as storageRef } from "firebase/storage";
import { compose } from "redux";
import { object } from "yup";
import { ComentType, PostType, UserType } from "../Redux/Types";
import { firebaseConfig, Firebase_auth } from "./FirebaseConfig"
import { usersAPI } from "./UsersAPI";


const app = initializeApp(firebaseConfig)

export const fireStore = getFirestore(app)


class FirestoreAPI {
    //Firebase app
    protected app = initializeApp(firebaseConfig)
    //Firebase Firestore database instance
    protected fireStore = getFirestore(this.app)
    //Firebase init storage
    protected storage = getStorage(this.app)
    //Google Auth provider from firebase auth needs to loging in with google popUp 
    protected googleAuthProvider = new GoogleAuthProvider()
    //Firebase storage refrence
    protected storageRef = storageRef(this.storage)
    //Firebase auth instance
    protected firebaseAuth = Firebase_auth


    public async logInWithGooglePopUp() {
        try {
            const userAuthCredeintials = await (await signInWithPopup(this.firebaseAuth, this.googleAuthProvider)).user
            //Get the refrence of user document
            const userRef = await doc(this.fireStore, "Users", userAuthCredeintials.uid)
            //Get the document by document ref and return from function result of "exist()" method
            const userDoc = await (await getDoc(userRef))
            //If user exist in firestore database return user document anotherwise create new user document and then return user 
            if (!userDoc.exists()) {
                //Create new user document ref
                const newUserRef = await collection(this.fireStore, "Users")
                //Create user account object to pass him into the setDoc to create new document
                let userData: UserType = {
                    fullName: userAuthCredeintials.displayName as string,
                    userID: userAuthCredeintials.uid as string,
                    avatar: userAuthCredeintials.photoURL as string,
                    followers: [],
                    subscribes: []

                }
                //Creating the document
                await setDoc(doc(newUserRef, userAuthCredeintials.uid), userData);
                return userData
            } else {

                return userDoc.data()
            }
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

}

class UsersAPI extends FirestoreAPI {
    //Get userpage by user id
    public async getUserPageByID(userID: string) {
        try {
            //userPage ref
            const userPageRef = doc(this.fireStore, "Users", userID)
            const userDoc = await getDoc(userPageRef)
            if (userDoc.exists()) {
                return userDoc.data()
            } else {
                throw new Error("User page does not exist")
            }
        } catch (ex) {
            console.log(ex)
            return ex
        }
    }
}

class PostsAPI extends FirestoreAPI {
    //Get post list by user ID 
    public async getUserPostsByUserID(userID: string) {
        try {
            const q = await query(collection(this.fireStore, "Posts"), where("creatorID", "==", userID))
            const docSnap = await getDocs(q)
            const postData: Array<any> = []
            //If snapShot not containing any document return null
            //Anotherwise push all elements into postData[] ande return them
            if (!docSnap.empty) {
                docSnap.forEach((doc) => { 
                    console.log(doc.data())
                    postData.push({...doc.data(),id: doc.id})  
                })
                console.log(postData)
                return postData
            } else {
                return null
            }

        } catch (ex) {
            console.log(ex)
            return ex
        }
    }
    //Create post function 
    public async createPost (post : PostType) {
        try{
            const postRef = await collection(this.fireStore,"Posts")
            const newPost = {...post,id : postRef.id}
        
            await setDoc(doc(postRef,),newPost)

            const ref = await doc(this.fireStore,"Posts",post.creatorID)
            const newPostDocument = await getDoc(ref)
            return newPostDocument.data()
        }catch(ex){
            console.log(ex)
            return ex
        }
    
    }
    //Add like to post 
    public async addLikeToPost (postID : string,currentUserID : string) {
        try{
            const postRef = await doc(this.fireStore,"Posts",postID)
            const postDoc  = await (await getDoc(postRef))
            // arrayRmove if post already contains cuerentUserID in likes_count field
            // If not contain arrayUnion
            if(Object.hasOwn(postDoc, "likes_count") && Object.values(postDoc.data()?.likes_count).includes(currentUserID)){
                const postLikesRef = await doc(this.fireStore,"Posts",postID)
                await updateDoc(postLikesRef,{likes_count : arrayRemove(currentUserID)})
            }else{
                const postLikesRef = await doc(this.fireStore,"Posts",postID)
                await updateDoc(postLikesRef,{likes_count : arrayUnion(currentUserID)})
    
            }
            
        }catch(ex){
            console.log(ex)
            return ex
        }
    }
    //Remove Post 
    public async RemovePostByPostID (postId : string) {
        try{
            const postRef = await doc(this.fireStore,"Posts",postId)
            await deleteDoc(postRef)
            return true
        }catch(ex){
            console.log(ex)
        }
    }
    //Add coment to post
    public async addComentToPost (postID : string,coment : ComentType) {
        try{
            const postRef = await doc(this.fireStore,"Posts",postID)
            
        }catch(ex){
            console.log(ex)
        }
    }
}


export const fireStoreAPI = new FirestoreAPI()
export const firestoreUSersAPI = new UsersAPI()
export const firestorePostsAPI = new PostsAPI()