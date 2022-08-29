import { dataBase, Firebase_auth } from "./FirebaseConfig";
import { firebase } from "./FirebaseConfig";
import { ref, get, child, push, update, remove, onValue } from "firebase/database";
import { getStorage, ref as storage_ref, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import { makeid } from "./Randomizer";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";


//Abstarct API class 
export class abstractAPI {
    protected RealtimeDataBase = dataBase
    protected DatabaseRef = ref(dataBase)
    protected firebaseAPP = firebase
    protected firebaseStorage = getStorage(this.firebaseAPP)
    protected storageRefrence = storage_ref(this.firebaseStorage)
    protected firebaseAuth = Firebase_auth
    protected googleAuthProvider = new GoogleAuthProvider()
    public onValue = onValue
    public ref = ref

    public getAuthProvider() {
        return this.googleAuthProvider
    }
    public getAuthInstatnce() {
        return this.firebaseAuth
    }
    public getApp() {
        return this.firebaseAPP
    }
    public getDatabase() {
        return this.RealtimeDataBase
    }
    
}

class PostAPI extends abstractAPI {
    constructor() {
        super()
    }
    async getPostListRealtime(userID: string) {
        const postRef = ref(this.RealtimeDataBase,"Users/" + userID + "/posts/")
        let postList : Array<any> = []
        onValue(postRef,(postSnapSchot) => {
            postSnapSchot.forEach((post) => {
                postList.push(post.val())
            })
        })
        return postList
    }

    async createPost(userID: string, postIMG: Blob | Uint8Array | ArrayBuffer, postText: string, postTag: Array<string>, creator: string) {
        //Create random image name with makeid function (exposts from Randomizer.ts)
        const imageID: string = makeid(12);
        //Image ref
        const imageRef: StorageReference = storage_ref(this.storageRefrence, imageID)
        //If _img from arguments !== null dowload the file in storage with image_name
        if (postIMG !== null) {
            //Uploading the image
            uploadBytes(imageRef, postIMG).then(() => {
                //After upload get the dowload url of the image to put them in database
                getDownloadURL(imageRef).then((url) => {
                    const newPostKey = push(child(ref(this.RealtimeDataBase), "Users" + userID + "/posts/")).key;
                    //Creating the post JSON object for database
                    const postData = {
                        post_text: postText,
                        postTags: postTag,
                        post_img: url,
                        creator: creator,
                        likes_count: [],
                        createdAt: new Date().getDate(),
                        id: newPostKey,

                    }
                    const updates: any = {};
                    updates[`Users/` + userID + "/posts/" + newPostKey] = postData;
                    //Update Database with new element
                    return update(ref(this.RealtimeDataBase), updates);
                })
            })
        }
    }
    async savePostToGalery(userID: string, currentUserID: string, postID: string) {
        const savedPostKey = await (await get(child(this.DatabaseRef, "Users/" + userID + "/posts/" + postID))).key
        const savedPostData = {

        }
        const updates: any = {}
        updates["Users/" + currentUserID + "/savedPosts/" + savedPostKey] = savedPostData
        return update(this.DatabaseRef, updates)

    }
    async deletePsotFromGalery(currentUserID: string, postID: string) {
        const result = await remove(child(this.DatabaseRef, "Users/" + currentUserID + "/savedPosts/" + postID))
        console.log(result)
        return result
    }
    async deletePost(userID: string, postID: string) {
        const result = await remove(child(this.DatabaseRef, "Users/" + userID + "/posts/" + postID))
        console.log(result)
        return result
    }
    async getPostByID(userID: string, postID: string) {
        //The function takes as arguments the userID(string) and the postID(string) as an argument.
        //Returns the object of the post containing the following fields (picture, text, number of likes, creator of the post
        //And an array of comments(Array<string>)

        const post = await (await get(child(this.DatabaseRef, "Users/" + userID + "/posts/" + postID))).val()
        return post
    }
    async getListOfPosts(userID: string) {
        //This method will return all posts userID(Array<PostType>)
        
        const postsList = await (await (await get(child(this.DatabaseRef, "Users/" + userID + "/posts/"))))
 
        return postsList
    }

    async addLikeToPost(currentUserID: string, userID: string, postID: string) {
        //Get post refrence
        // Each single like in the database is a unique identifier for the user who put the like.
        const post = await (await get(child(this.DatabaseRef, "Users/" + userID + "/posts/" + postID))).val()

        //if post object contains key likes_count and this key contains cyrrentUserID remove like anotherwise add like
        if (Object.hasOwn(post, "likes_count") && Object.values(post.likes_count).includes(currentUserID)) {
            //Dislike
            //Update data with null value to delete data from RealtimeDatabse
            let data = null
            const updates: any = {}
            const likeKey = Object.keys(post.likes_count).find(key => post.likes_count[key] === currentUserID)
            updates["Users/" + userID + "/posts/" + postID + "/likes_count/" + likeKey] = data
            return update(ref(this.RealtimeDataBase), updates)

        } else {
            //Like
            //To add the like push currentUserID (witch click the like button) in Posts/likes_couunt in Database
            const newLike = await push(child(this.DatabaseRef, "Users/" + userID + "/posts/" + postID + "/likes_count/")).key
            const data = currentUserID
            const updates: any = {}
            updates["Users/" + userID + "/posts/" + postID + "/likes_count/" + newLike] = data
            return update(ref(this.RealtimeDataBase), updates)

        }

    }
    async removeLikefromPost(userID: string, postID: string, likeOwnerID: string) {
        const result = await remove(child(this.DatabaseRef, "Users/" + userID + "/posts/" + postID + "likes" + likeOwnerID))
        console.log(result)
        return result
    }
    async addComentToPost(userID: string, postID: string, comentText: string, creator: string, avatar: string) {
        //create id by ID generator
        const comentID = makeid(9)
        try {
            if (comentText.length > 0) {
                const comentData = {
                    coment_text: comentText,
                    coment_owner_name: creator,
                    avatar: avatar,
                    date: new Date().getUTCDate(),
                    comentID: comentID
                };
                const updates: any = {}
                updates["Users/" + userID + "/posts/" + postID + "/coments/" + comentID] = comentData
                return update(ref(this.RealtimeDataBase), updates)
            } else {
                throw new Error("Error : Coment canot be an ampty string!")
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    async deleteComent(userID: string, postID: string, comentID: string) {
       
        let data = null
        const updates: any = {}
        updates["Users/" + userID + "/posts/" + postID + "/coments/" + comentID] = data
        return update(ref(this.RealtimeDataBase), updates)

    }
}

//Exporting the postAPI class
export const postAPI = new PostAPI()

