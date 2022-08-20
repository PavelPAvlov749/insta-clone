import { ref, get, child, push, update ,query, DatabaseReference,orderByChild,equalTo, remove} from "firebase/database";
import { stringify } from "querystring";
import { IndexKind, isObjectLiteralElement } from "typescript";
import { UserType } from "../Redux/Types";

import { abstractAPI } from "./PostApi";




class UsersAPI extends abstractAPI {
    constructor() {
        super()
    }
    async getAllUsers () {
        let usersRef : DatabaseReference = ref(this.RealtimeDataBase,"Users/")
        let result = await get(query(usersRef))
        return result.val()
    }
    async getUserPageById(userID: string) {
        let usersRef : DatabaseReference = ref(this.RealtimeDataBase, "Users/" + userID)
        let result  = await (await get(query(usersRef))).val()
        if(result){
            const user : UserType= {
                userID : result.userID,
                fullName : result.fullName,
                avatar : Object.hasOwn(result,"avatar") ? result.avatar : null as unknown as string,
                followers : Object.hasOwn(result,"followers") ? result.followers : null as unknown as string,
                subscribes : Object.hasOwn(result,"subscribers") ? result.subscribers : null as unknown,
                status : result.status,
            }
            return user
        }

    }
    async getUserPageByName(userName: string) {
        let users_ref : DatabaseReference = ref(this.RealtimeDataBase, "Users/");
        let result = await get(query(users_ref, orderByChild("fullName/"), equalTo(userName)));
        return result.val();
    }
    async sendMessage (currentUserID : string,userID:string,messagetext : string) {
        
    }
    async followUser(currentUserID: string, userToFollowID: string) {
        const followerList = await (await get(child(this.DatabaseRef, "Users/" + userToFollowID)))
            console.log(Object.hasOwn(followerList.val(),"/followers/"))
            console.log(followerList.val())
            if(Object.hasOwn(followerList.val(),"followers") && Object.values(followerList.val().followers).includes(currentUserID)){
                const updates: any = {}
                const likeKey = Object.keys(followerList.val().followers).find(key => followerList.val().followers[key] === currentUserID)
                console.log(likeKey)
               
                updates["Users/" + userToFollowID + "/followers/" + likeKey] = null
                updates["Users/" + currentUserID + "/subscribers/" + userToFollowID] = null
                return update(ref(this.RealtimeDataBase), updates)
                
            }else{
                let usersRef = ref(this.RealtimeDataBase, "Users/" + userToFollowID)
                let followedUser = await get(query(usersRef))
                const newFollower = push(child(ref(this.RealtimeDataBase), "Users" + userToFollowID + "/followers/" )).key
                const updates: any = {}
                updates["Users/" + currentUserID + "/subscribers/" + userToFollowID] = followedUser.val()
                updates["Users/" + userToFollowID + "/followers/" + newFollower] = currentUserID
                return update(ref(this.RealtimeDataBase), updates)
            }

        }
}

export const usersAPI = new UsersAPI()