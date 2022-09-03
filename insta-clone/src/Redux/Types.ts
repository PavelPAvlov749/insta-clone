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
    comentatorAvatar : string | null 
}

export type PostType = {
    post_text : string,
    post_img : string,
    id? : string,
    likes_count : Array<string>,
    creator : string,
    createdAt? : typeof  Date,
    coments : Array<ComentType>,
}
export type ChatType = {
    fullName : string,
    avatar : string,
    chatRef : string
}
export type MessageType = {
    fullName : string,
    userID : string,
    avatar : string,
    messageData : string,
    createdAt : any,
}