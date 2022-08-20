

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
    comentText : string,
    comentatorName : string,
    comentatorID : string,
    comentatorAvatar : string 
}

export type PostType = {
    postText : string,
    postIMG : string,
    postID : string,
    likesCount : Array<string>,
    createdAt : typeof  Date,
    coments : Array<ComentType>,
}

export type MessageType = {
    userID : string,
    avatar : string,
    messageData : string,
    messageID : string,
    creadtedAd : typeof Date,
}