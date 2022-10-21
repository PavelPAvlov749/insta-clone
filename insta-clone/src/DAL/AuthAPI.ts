import { ref, get, child, push, update, query } from "firebase/database";
import { abstractAPI } from "./PostApi";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, User, onAuthStateChanged } from "firebase/auth";



class AuthAPI extends abstractAPI {
    constructor() {
        super()
    }
    checkAuthState = onAuthStateChanged

    async signInWithPopUp() {
        const result = await signInWithPopup(this.firebaseAuth, this.googleAuthProvider).then((response) => {
            const userRef = ref(this.RealtimeDataBase, "Users/" + this.firebaseAuth.currentUser?.uid);
            const result = get(userRef,).then((response) => {
                if (response.val() === null || response.val() === undefined) {
                    console.log("ADDING NEW USER")
                    const new_user = {
                        fullName: this.firebaseAuth.currentUser?.displayName,
                        posts: {},
                        status: null,
                        foloowers: {},
                        subscribes: {},
                        userID: this.firebaseAuth.currentUser?.uid,
                        avatar: this.firebaseAuth.currentUser?.photoURL
                    };
                    const updates: any = {};
                    updates["Users/" + this.firebaseAuth.currentUser?.uid] = new_user;
                    update(ref(this.RealtimeDataBase), updates);
                    return response
                }
            })
            return response
        })
        return result
    }
    async signInByEmailAndPassword(email: string, password: string) {
        try {
            
            const userID = await (await signInWithEmailAndPassword(this.firebaseAuth, email, password)).user.uid
            return userID
        } catch (ex) {
            console.log(ex)
        }
    }
    async signOut() {
        await signOut(this.firebaseAuth)

    }

    async createUserWithEmailAndPassword(email: string, password: string, userName: string,avatar?:Blob | Uint16Array | ArrayBuffer,status? : string) {
        try {
            const newUser = (await createUserWithEmailAndPassword(this.firebaseAuth, email, password)).user
            const newUserRef = push(child(ref(this.RealtimeDataBase), "Users/")).key
            const RealtimeDatabaseUser = {
                fullName: userName,
                userID: newUser.uid,
                avatar: null,
                posts: {},
                likesCount: null,
                status: null,
                followers: {},
                subscibes: {},
                chat: {},
                savedPosts: {}
            }
            const updates: any = {};
            updates[`Users/` + newUser.uid] = RealtimeDatabaseUser;
            //Update Database with new element
            update(ref(this.RealtimeDataBase), updates);
            const user = get(child(this.ref(this.RealtimeDataBase),"Users/" + newUser.uid))
            console.log(user)
            return user
        } catch (ex) {
            console.log(ex)
        }
    }
    async getCurrentUserID() {
        const currentUserID = await this.firebaseAuth.currentUser?.uid
        if (currentUserID) {
            return currentUserID
        }
    }
    async getAccount(userID: string) {
        try {
            let usersRef = ref(this.RealtimeDataBase, "Users/" + userID)
            let result = await (await get(query(usersRef))).val()
            if (result) {
                const account = {
                    fullName : result.fullName,
                    avatar : result.avatar,
                    userID : result.userID,
                    status : result.status,
                    chats : Object.hasOwn(result,"chats") ? Object.values(result.chats) : [] as Array<any>
                }
                return account
            } else {
                throw new Error()
            }

        } catch (ex) {
            console.error(ex)
        }

    }
}

export const authAPI = new AuthAPI()