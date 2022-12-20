import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { child, get, update } from "firebase/database";
import { getFirestore, addDoc, collection, getDoc, getDocs, doc, setDoc, query, 
        orderBy, where, DocumentData, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, ref as storageRef, StorageReference, uploadBytes } from "firebase/storage";
import { ComentType, PostType, UserPagePreview, UserType } from "../Redux/Types";
import { firebaseConfig, Firebase_auth } from "./FirebaseConfig"
import { makeid } from "./Randomizer";



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
                status : ""
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
                    status : ""

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

class UsersAPI extends FirestoreAPI {
    //Get All users 
    public async getAllUsers (from? : number,to? : number) {
        try{
            const usersRef = await collection(this.fireStore,"Users")
            const usersSnap = await getDocs(usersRef)
            let users : Array<UserType> = []
    
            usersSnap.forEach((snap) => {
                users.push(snap.data() as UserType)
            })
            return users
        }catch(ex){
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
    public async getFollowedUsers (userID : string) {
        try{
            const followedUsersRef = await collection(this.fireStore,"Users/" + userID,"/followed")
            const followedUsersSnap = await (await getDocs(followedUsersRef))
            let users : Array<any> = []
            console.log(followedUsersSnap.forEach((snap) => {return snap.data()}))
            if(!followedUsersSnap.empty){
               
                followedUsersSnap.forEach((snap) => {
                    users.push(snap.data())
                })
            }else{
                console.log(null)
                return null
            }
        }catch(ex){
            console.log(ex)
            return ex
        }
    }
    //Get all user followers 
    public async getFollowers (userID : string) {
        try{
            const followersRef = await doc(this.fireStore,"Users",userID)
            const followersSnap = await getDoc(followersRef)
            if(followersSnap.exists()){
                return followersSnap.data()
            }else{
                throw new Error("Cant fetch the followers")
            }
        }catch(ex){
            console.log(ex)
            return ex
        }
    }
    //Get users by Name 
    public async getUsersByName (userName : string) {
        try{
            const usersRef = await query(collection(this.fireStore,"Users"),where("fullName","==",userName))
            const usersSnap = await getDocs(usersRef)
            let users : Array<any> = []
            if(!usersSnap.empty){
                console.log(usersSnap.docs)
                usersSnap.forEach((snap) => {
                    console.log(snap.data())
                    users.push(snap.data())
                })
                return users
            }else{
                return null
            }
           
        }catch(ex){
            console.log(ex)
            return ex
        }
    }
    //Follow toggle function 
    public async followToggle(userToFollow: UserPagePreview, currentUser: UserPagePreview) {
        try {
            const userToFollowRef = await doc(this.fireStore, "Users", userToFollow.userID)
            const currentUserRef = await doc(this.fireStore,"Users",currentUser.userID)
            //userDocument snapshot
            const userToFollowSnap = (await getDoc(userToFollowRef)).data()
            //If followers already contain current user ID remove them from array if not push current userID in array
            if (userToFollowSnap?.followers.find((user : any) => {
                if(user.userID === currentUser.userID){ return true }})) {
                await updateDoc(userToFollowRef, { followers: arrayRemove(currentUser) })
                await updateDoc(currentUserRef, { followed: arrayRemove(userToFollow) })
            } else {
                await updateDoc(userToFollowRef, { followers: arrayUnion(currentUser) })
                await updateDoc(currentUserRef, { followed: arrayUnion(userToFollow) })
            }
        } catch (ex) {
            console.log(ex)
            return ex
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

            await setDoc(doc(postRef,), newPost)

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

        } catch (ex) {
            console.log(ex)
        }
    }
}


export const fireStoreAPI = new FirestoreAPI()
export const firestoreUSersAPI = new UsersAPI()
export const firestorePostsAPI = new PostsAPI()