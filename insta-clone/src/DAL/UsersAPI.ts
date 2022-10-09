import { ref, get, child, push, update, query, DatabaseReference, orderByChild, equalTo, remove, startAt, startAfter, endBefore } from "firebase/database";
import { UserType } from "../Redux/Types";

import { abstractAPI } from "./PostApi";




class UsersAPI extends abstractAPI {
    constructor() {
        super()
    }
    async getAllUsers() {
        const usersList = await (await get(child(this.DatabaseRef,"Users/"))).val()
        let usersRef: DatabaseReference = ref(this.RealtimeDataBase, "Users/")
        let result = await get(query(usersRef))
        return usersList
    }
    async getUserPageById(userID: string) {
        let usersRef: DatabaseReference = ref(this.RealtimeDataBase, "Users/" + userID)
        let result = await (await get(query(usersRef))).val()
        if (result) {
            const user: UserType = {
                userID: result.userID,
                fullName: result.fullName,
                avatar: Object.hasOwn(result, "avatar") ? result.avatar : null as unknown as string,
                followers: Object.hasOwn(result, "followers") ? Object.values(result.followers as Array<string>) : [] as Array<string>,
                subscribes: Object.hasOwn(result,"subscribers" ) ? Object.values(result.subscribers as Array<string>) : [] as Array<string>,
                status: result.status,
            }
            return user
        }

    }
    async getUserPageByName(userName: string) {
    
            let users_ref: DatabaseReference = ref(this.RealtimeDataBase, "Users/");
            let result  = await get(query(users_ref, orderByChild("fullName/"), equalTo(userName)))
            if(result.exists()){
                return Object.values(result.val())
            }else{
                return null
            }
            
    }
    async sendMessage(currentUserID: string, userID: string, messagetext: string) {

    }
    async followUser(currentUserID: string, userToFollowID: string) {
        const followerList = await (await get(child(this.DatabaseRef, "Users/" + userToFollowID)))

        if (Object.hasOwn(followerList.val(), "followers") && Object.values(followerList.val().followers).includes(currentUserID)) {
            const updates: any = {}
            const likeKey = Object.keys(followerList.val().followers).find(key => followerList.val().followers[key] === currentUserID)
            updates["Users/" + userToFollowID + "/followers/" + likeKey] = null
            updates["Users/" + currentUserID + "/subscribers/" + userToFollowID] = null
            return update(ref(this.RealtimeDataBase), updates)

        } else {
            let usersRef = ref(this.RealtimeDataBase, "Users/" + userToFollowID)
            let followedUser = await get(query(usersRef))
            const newFollower = push(child(ref(this.RealtimeDataBase), "Users" + userToFollowID + "/followers/")).key
            const updates: any = {}
            updates["Users/" + currentUserID + "/subscribers/" + userToFollowID] = followedUser.val()
            updates["Users/" + userToFollowID + "/followers/" + newFollower] = currentUserID
            return update(ref(this.RealtimeDataBase), updates)
        }

    }
    async getAvatar (userID:string) {
        const avatarRef : DatabaseReference = ref(this.RealtimeDataBase, "Users/" + userID + "/avatar/")
        const avatar = await (await get(query(avatarRef))).val()
        if(avatar) {
            return avatar
        }else{
            return null as unknown as string
        }

    }
    async getFollowers (userID : string) {
        try{
            const followersRef : DatabaseReference = await ref(this.RealtimeDataBase,"Users/" + userID + "/followers")
            const users = await (await get(query(followersRef))).val()

            if(users) {
                return users
            }else{
                return null
            }
        }catch(ex){
            console.log(ex)
        }

    }
    async getFollowedUsers (userID : string) {
        try{
            const FolowedRef = ref(this.RealtimeDataBase,"Users/" + userID + "subscribes")
            const users = (await get(query(FolowedRef))).val()
            if(users) {
                return users
            }else{
                return null
            }
        }catch(ex){
            console.log(ex)
        }
    }
}

export const usersAPI = new UsersAPI()