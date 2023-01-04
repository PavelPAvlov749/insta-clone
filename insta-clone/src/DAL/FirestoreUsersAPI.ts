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
import { fireStoreAPI } from "./Firestore";
import { makeid } from "./Randomizer";


class UsersAPI  {
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
    //Get All users 
    public async getAllUsers(from?: number, to?: number) {
        try {
            const usersRef = await collection(this.fireStore, "Users")
            const usersSnap = await getDocs(usersRef)
            let users: Array<UserType> = []

            usersSnap.forEach((snap) => {
                users.push(snap.data() as UserType)
            })
            return users
        } catch (ex) {
            console.log(ex)
            return ex
        }
    }
    //Update user avatar 
    public async updateAvatar(userID: string, avatarIMG: Blob | ArrayBuffer | Uint16Array) {
        try {
            //Create random image name with makeid function (exposts from Randomizer.ts)
            const avatarID = makeid(13)
            // const avatarID = await doc(this.fireStore,"Users",userID + "/" + "avatar").id
            const userRef = await doc(this.fireStore, "Users", userID)
            //Image avatar ref
            const avatarRef: StorageReference = ref(this.storage, avatarID)
            //If _img from arguments !== null dowload the file in storage with image_name
            if (avatarIMG !== null) {
                await uploadBytes(avatarRef, avatarIMG)
                const url = await getDownloadURL(avatarRef)
                console.log(url)
                await updateDoc(userRef, { avatar: url })
                return url
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    //Update user status function 
    public async updateUserStatus(userID: string, newStatus: string) {
        try {
            const userRef = await doc(this.fireStore, "Users", userID)
            await updateDoc(userRef, { status: newStatus })
        } catch (ex) {
            console.log(ex)
            return ex
        }
    }
    //Get followed users 
    public async getFollowedUsers(userID: string) {
        try {
            const followedUsersRef = await doc(this.fireStore, "Followed/" + userID)
            const followedUsersSnap = await (await getDoc(followedUsersRef))
            console.log(followedUsersSnap)
            if(followedUsersSnap.exists()){
                console.log(followedUsersSnap.data())
                return followedUsersSnap.data().followed
            }else{
                return null
            }
        } catch (ex) {
            console.log(ex)
            return ex
        }
    }
    //Get all user followers 
    public async getFollowers(userID: string) {
        try {
            const followersRef = await doc(this.fireStore, "Followers/", userID)
            debugger
            const followersSnap = await getDoc(followersRef)
            if (followersSnap.exists()) {
                console.log(followersSnap.data())
                return followersSnap.data()
            } else {
                throw new Error("Cant fetch the followers")
            }
        } catch (ex) {
            console.log(ex)
            return ex
        }
    }
    //Get users by Name 
    public async getUsersByName(userName: string) {
        try {
            const usersRef = await query(collection(this.fireStore, "Users"), where("fullName", "==", userName))
            const usersSnap = await getDocs(usersRef)
            let users: Array<any> = []
            if (!usersSnap.empty) {
                console.log(usersSnap.docs)
                usersSnap.forEach((snap) => {
                    console.log(snap.data())
                    users.push(snap.data())
                })
                return users
            } else {
                return null
            }

        } catch (ex) {
            console.log(ex)
            return ex
        }
    }
    //Follow toggle function 
    public async followToggle (userToFollow : UserPagePreview,currentUser : UserPagePreview) {
        try {
            const followedUserRef = await doc(this.fireStore,"Followed/",currentUser.userID)
            const followedUserDoc = await getDoc(followedUserRef)
            console.log(followedUserDoc.data())
            console.log()
            if(!followedUserDoc.exists()){
                console.log("SET NEW DOC")
                
                const newFollowedUserRef = await doc(this.fireStore,"Followers",userToFollow.userID)
                const newCurrentUserRef = await doc(this.fireStore,"Followed",currentUser.userID)
                const followedUserPageRef = await doc(this.fireStore,"Users",userToFollow.userID)
                const currentUserPageRef = await doc(this.fireStore,"Users",currentUser.userID)
                await setDoc(newFollowedUserRef,{followers : [currentUser]})
                await setDoc(newCurrentUserRef,{followed : [userToFollow]})
                await updateDoc(followedUserPageRef,{followers : arrayUnion(currentUser.userID)})
                await updateDoc(currentUserPageRef,{followed : arrayUnion(userToFollow.userID)})
            }else{
                if(followedUserDoc.data()?.followed.find((user : UserPagePreview) => user.userID === userToFollow.userID)){
                    console.log("REMOVE DOC")
                    const newFollowedUserRef = await doc(this.fireStore,"Followers",userToFollow.userID)
                    const newCurrentUserRef = await doc(this.fireStore,"Followed",currentUser.userID)
                    const followedUserPageRef = await doc(this.fireStore,"Users",userToFollow.userID)
                    const currentUserPageRef = await doc(this.fireStore,"Users",currentUser.userID)
                    await updateDoc(newFollowedUserRef,{followers : arrayRemove(currentUser)})
                    await updateDoc(newCurrentUserRef,{followed : arrayRemove(userToFollow)})
                    await updateDoc(followedUserPageRef,{followers : arrayRemove(currentUser.userID)})
                    await updateDoc(currentUserPageRef,{followed : arrayRemove(userToFollow.userID)})
                }else {
                    console.log("Union docs")
                    const newFollowedUserRef = await doc(this.fireStore,"Followers",userToFollow.userID)
                    const newCurrentUserRef = await doc(this.fireStore,"Followed",currentUser.userID)
                    const followedUserPageRef = await doc(this.fireStore,"Users",userToFollow.userID)
                    const currentUserPageRef = await doc(this.fireStore,"Users",currentUser.userID)
                    await updateDoc(newFollowedUserRef,{followers : arrayUnion(currentUser)})
                    await updateDoc(newCurrentUserRef,{followed : arrayUnion(userToFollow)})
                    await updateDoc(followedUserPageRef,{followers : arrayUnion(currentUser.userID)})
                    await updateDoc(currentUserPageRef,{followed : arrayUnion(userToFollow.userID)})
                }
            }
        } catch(ex){
            console.log(ex)
        }
    }
  
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

export const firestoreUSersAPI = new UsersAPI()