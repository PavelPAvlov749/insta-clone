import { BlockLike } from "typescript"


//Main Compoenent PropsType (App.tsx)
export type AppPropsType = {
    isInit: boolean,
    isFetch: boolean,
    init: () => void,
    currentUserID: string | null,
    isNewPost: boolean,
    setIsOnNewPost: (isPost: boolean) => void,
    isAuth: boolean,
    isNewMessage : boolean

}

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
    avatar? : string,
    messageData : string,
    createdAt : any,
    messageStatus : "unreaded" | "readed",
    messageID? : string | null
}
export type AvatarPropsType = {
    fullName? : string,
    avatarIMG : string | null,
    size : "large" | "small" | "chatSize",
    userID? : string
}
export type CreateNewUserType = {
    userName : string ,
    password : string,
    confirmPassword : string,
    email : string ,
}

export type newChatType = {
    sender : {
        senderID : string,
        senderFullName : string,
        avatar? : string 
    },
    recepient : {
        recepientID : string,
        recepientFullName : string,
        avatar? : string 
    }
}

export type MessagePropsType = {
    messageText: string,
    userName: string,
    userID: string,
    currentUserID : string,
    avatar : string | null
}

export type newMessagePropsType = {
    messageText: string,
    createdAt?: string,
    senderID: string,
    senderFullName: string,
    messageStatus: "unreaded" | "readed",
    messageID: string,
    chatID : string,

}