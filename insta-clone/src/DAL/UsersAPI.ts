import { ref, get, child, push, update, query, DatabaseReference, orderByChild, equalTo, remove, startAt, startAfter, endBefore } from "firebase/database";
import { UserPagePreview, UserType } from "../Redux/Types";

import { abstractAPI } from "./PostApi";




class UsersAPI extends abstractAPI {
    constructor() {
        super()
    }
    async followUser2(currentUserID : string, user : UserType){
        try{
            const key = await push(child(ref(this.RealtimeDataBase),"Followed/")).key
            let data = {
                userID : user.userID,
                fullName : user.fullName,
                avatar : user.avatar
            }
            let updates : any = {}
            updates["Followed/" + currentUserID + "/" + key] = data
            await update(ref(this.RealtimeDataBase),updates)
        }catch(ex){
            console.log(ex)
        }
       
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
                followers: result.followers,
                followed: result.followed,
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

    async followUser(currentUser : UserPagePreview, userToFollow : UserPagePreview) {
        const followerList = await (await get(child(this.DatabaseRef, "Users/" + userToFollow.userID)))
        //Check if current user alredy follow the specific user 
        if (Object.hasOwn(followerList.val(), "followers") && Object.values(followerList.val().followers).includes(currentUser.userID)) {
            const updates: any = {}
            const likeKey = Object.keys(followerList.val().followers).find(key => followerList.val().followers[key] === currentUser.userID)
            updates["Followers/" + userToFollow.userID] = null
            updates["Followed/" + currentUser.userID] = null
            await update(ref(this.RealtimeDataBase), updates)

        } else {
            let usersRef = ref(this.RealtimeDataBase, "Users/" + userToFollow.userID)
            // let followedUser = await get(query(usersRef))
            const newFollower = push(child(ref(this.RealtimeDataBase), "Users" + userToFollow.userID + "/followers/")).key
            const updates: any = {}
            updates["Followers/" + currentUser.userID + newFollower] = 
                 {fullName : userToFollow.fullName,avatar : userToFollow.avatar,userID : userToFollow.userID}
            updates["Followed/" + userToFollow.userID + newFollower] = 
                {fullName : currentUser.fullName,avatar : currentUser.avatar,userId : currentUser.userID}
            await update(ref(this.RealtimeDataBase), updates)
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
            const followersRef : DatabaseReference = await ref(this.RealtimeDataBase,"Followers/" + userID)
            const users = await (await get(query(followersRef))).val()
            console.log(users)
            if(users) {     
                console.log(users)
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
            const FolowedRef = ref(this.RealtimeDataBase,"Followed/" + userID)
            const users = (await get(query(FolowedRef))).val()
            console.log(users)
            if(users) {
                return Object.values(users)
            }else{
                return null
            }
        }catch(ex){
            console.log(ex)
        }
    }
}

export const usersAPI = new UsersAPI()