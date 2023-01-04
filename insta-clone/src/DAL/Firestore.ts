import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { child, DataSnapshot, get, update } from "firebase/database";
import {
    getFirestore, addDoc, collection, getDoc, getDocs, doc, setDoc, query,
    orderBy, where, DocumentData, updateDoc, arrayUnion, arrayRemove, deleteDoc, FieldValue, increment,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, ref as storageRef, StorageReference, uploadBytes } from "firebase/storage";
import { isRestTypeNode, updateDo } from "typescript";
import { ComentType, PostType, UserPagePreview, UserType } from "../Redux/Types";
import { followTooglethunk } from "../Redux/UserPageReducer";
import { firebaseConfig, Firebase_auth } from "./FirebaseConfig"
import { makeid } from "./Randomizer";



const app = initializeApp(firebaseConfig)

export const fireStore = getFirestore(app)


export class FirestoreAPI {
    
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
    //Auth instanse and getter t them
    protected authInstanse = getAuth()
    public getAuth = this.authInstanse
    //Login with email and oassword
    public async signInByEmailAndPassword(email: string, password: string) {
        try {
            const user = await (await signInWithEmailAndPassword(this.firebaseAuth, email, password)).user.uid
            if (user) {
                return user
            } else {
                return null
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    //Registration for new user with email and password
    public async createNewUserWithEmailAndPassword(email: string, password: string, userNAme: string) {
        try {
            debugger
            const newUSer = await createUserWithEmailAndPassword(this.firebaseAuth, email, password)
            const userRef = await doc(this.fireStore, "Users", newUSer.user.uid)
            //New user object will be written in firestore database
            let userData = {
                fullName: userNAme,
                avatar: newUSer.user.photoURL,
                followed: [],
                followers: [],
                userID: newUSer.user.uid,
                status: ""
            }
            console.log(userData)
            await setDoc(userRef, userData)
            return userData

        } catch (ex) {
            console.log(ex)
            return ex
        }
    }
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
                    followed: [],
                    status: ""
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
    //LogOut
    public async logOut() {
        try {
            await signOut(this.firebaseAuth)
        } catch (ex) {
            console.log(ex)
            return ex
        }

    }

}



//                                :::::::::::::::::::::::::::: FIRESTORE POST API

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

                    postData.push({ ...doc.data(), id: doc.id })
                })

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
    public async createPost(post: PostType) {
        try {
            const postRef = await collection(this.fireStore, "Posts")
            const newPost = { ...post, id: postRef.id }

            await setDoc(doc(postRef),newPost)

            const ref = await doc(this.fireStore, "Posts", post.creatorID)
            const newPostDocument = await getDoc(ref)
            return newPostDocument.data()
        } catch (ex) {
            console.log(ex)
            return ex
        }

    }
    //Add like to post 
    public async addLikeToPost(postID: string, currentUserID: string) {
        try {
            const postRef = await doc(this.fireStore, "Posts", postID)
            const postDoc = await (await getDoc(postRef))
            // arrayRmove if post already contains cuerentUserID in likes_count field
            // If not contain arrayUnion
            if (Object.hasOwn(postDoc, "likes_count") && Object.values(postDoc.data()?.likes_count).includes(currentUserID)) {
                const postLikesRef = await doc(this.fireStore, "Posts", postID)
                await updateDoc(postLikesRef, { likes_count: arrayRemove(currentUserID) })
            } else {
                const postLikesRef = await doc(this.fireStore, "Posts", postID)
                await updateDoc(postLikesRef, { likes_count: arrayUnion(currentUserID) })

            }

        } catch (ex) {
            console.log(ex)
            return ex
        }
    }
    //Remove Post 
    public async RemovePostByPostID(postId: string) {
        try {
            const postRef = await doc(this.fireStore, "Posts", postId)
            await deleteDoc(postRef)
            return true
        } catch (ex) {
            console.log(ex)
        }
    }
    //Add coment to post
    public async addComentToPost(postID: string, coment: ComentType) {
        try {
            const postRef = await doc(this.fireStore, "Posts", postID)
            const comentID = await makeid(13)
            const newComent = { ...coment, comentID: comentID }
            const result = await updateDoc(postRef, { coments: arrayUnion(newComent) }).finally(() => true)
            return result

        } catch (ex) {
            console.log(ex)
        }
    }
    //Remove coment 
    public async removeComent(coment: ComentType, postID: string) {
        try {
            const postRef = await doc(this.fireStore, "Posts", postID)
            await updateDoc(postRef, { coments: arrayRemove(coment) })
        } catch (ex) {

        }
    }
}


export const fireStoreAPI = new FirestoreAPI()
export const firestorePostsAPI = new PostsAPI()