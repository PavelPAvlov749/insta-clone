import { type } from "@testing-library/user-event/dist/type"


export type MainAccountType = {
    userID : string | null,
    fullName : string | null,
    avatar : string | null,
    status : string | null,
    chats : Array<any> | null
}
export type UserType = {
    fullName : string,
    userID : string
    avatar : string,
    status : string,
    followers? : Array <string>,
    subscribes? : Array<string>,
    followed? : boolean,
    chats? : Array<ChatType>
}
export type ComentType = {
    coment_text : string | null,
    comentatorName : string | null,
    comentatorID : string | null,
    avatar : string | null,
    comentID? : string ,
    createdAt? : string 
}

export type PostType = {
    post_text : string,
    post_img : string,
    file? : Blob | Uint8Array | ArrayBuffer,
    id? : string,
    likes_count : Array<string>,
    creator : string,
    createdAt? : typeof  Date,
    coments : Array<ComentType>,
    creatorID : string,
    creatorAvatar : string
}
export type ChatType = {
    fullName : string,
    avatar : string,
    userID : string
}
export type MessageType = {
    fullName : string,
    userID : string,
    avatar : string,
    messageData : string,
    createdAt : any,
}