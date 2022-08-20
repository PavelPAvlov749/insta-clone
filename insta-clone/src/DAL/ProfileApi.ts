import { dataBase } from "./FirebaseConfig";
import { firebase } from "./FirebaseConfig";
import { ref, get, child, push, update } from "firebase/database";
import { getStorage, ref as storage_ref, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import { makeid } from "./Randomizer";
import { abstractAPI } from "./PostApi";

class ProfileAPI extends abstractAPI {
    constructor () {
        super ()
    }
    async getCurrentUserStatus ( userId:string) {
        const status = await get(ref(this.RealtimeDataBase,"Users/" + userId + "/status/"))
        return status.val()
    }
    async updateStatus (userID:string,statusText : string) {
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
    async updateAvatar (userID:string,avagtarIMG : Blob | Uint8Array | ArrayBuffer) {

    }
    async getFollowers (currentUserID : string){

    }
    async getSubscribes (currentUserID : string) {
        
    }

}

export const profileAPI = new ProfileAPI()