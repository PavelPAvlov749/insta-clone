

export type MainAccountType = {
    userID : string | null,
    fullName : string | null,
    avatar : string | null,
}
export type UserType = {
    fullName : string,
    userID : string
    avatar : string,
    status : string,
    followers? : Array <string>,
    subscribes? : Array<string>,
    followed? : boolean
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

export type MessageType = {
    userID : string,
    avatar : string,
    messageData : string,
    messageID : string,
    creadtedAd : typeof Date,
}