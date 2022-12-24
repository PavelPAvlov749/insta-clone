import { dataBase } from "./FirebaseConfig";
import { firebase } from "./FirebaseConfig";
import { ref, get, child, push, update } from "firebase/database";
import { getStorage, ref as storage_ref, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import { makeid } from "./Randomizer";
import { abstractAPI } from "./PostApi";

class ProfileAPI extends abstractAPI {
    constructor() {
        super()
    }
    async getCurrentUserStatus(userId: string) {
        const status = await get(ref(this.RealtimeDataBase, "Users/" + userId + "/status/"))
        return status.val()
    }
    async updateStatus(userID: string, statusText: string) {
        try {
            if (statusText.length > 0) {
                const status_data = statusText
                const updates: any = {};
                updates["Users/" + userID + "/status/"] = status_data;
                return update(ref(this.RealtimeDataBase), updates);
            } else {
                //if Status is empty string thorw an error
                throw new Error("Error : Cannot update!Status is empty string!")
            }
        } catch (ex) {
            //Log the error
            console.log(ex);
        }

    }
    async updateAvatar(userID: string, avatarIMG: Blob | ArrayBuffer | Uint16Array) {
        try{
        //Create random image name with makeid function (exposts from Randomizer.ts)
        const avatarID: string = makeid(12);
        //Image avatar ref
        const avatarRef: StorageReference = storage_ref(this.storageRefrence, avatarID)
        //If _img from arguments !== null dowload the file in storage with image_name
        console.log(avatarIMG)
        if (avatarIMG !== null) {
            await uploadBytes(avatarRef,avatarIMG)
            const url = await getDownloadURL(avatarRef)
            console.log(url)
            const updates : any = {}
            updates["Users/" + userID + "/avatar"] = url
            await update(ref(this.RealtimeDataBase),updates)
            return url
        }
    }catch(ex){
        console.log(ex)
    }

    }
    async getFollowers(currentUserID: string) {

    }
    async getSubscribes(currentUserID: string) {

    }

}

export const profileAPI = new ProfileAPI()