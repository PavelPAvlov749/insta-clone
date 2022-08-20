import { response } from "express";
import {
    getStorage,
    ref as storage_ref,
    uploadBytesResumable,
    uploadBytes,
    getDownloadURL,
    listAll} from "firebase/storage";
import { store } from "../Redux/Store";
import { firebaseConfig } from "./FirebaseConfig";
import { firebase } from "./FirebaseConfig";
import { makeid } from "./Randomizer";

export const Storage = getStorage(firebase);

//Create a storege reference


const storageRef = storage_ref(Storage,"bq.jpg");

console.log(storageRef.fullPath);
console.log(Storage.app.options.databaseURL)

const url = getDownloadURL(storage_ref(Storage,"3XNa8FLtuM7e")).then((response) => {
    console.log(response);
});

// 'file' comes from the Blob or File API
export const upload_photo = async (file:any) => {
    const storage = getStorage();
    const _id = makeid(12);
    const storageRef = storage_ref(storage, _id);
    
    await uploadBytes(storageRef,file ).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });
};

export const get_images_URL = async () => {
    const storage = getStorage();
    const storageRef = storage_ref(storage);
    getDownloadURL(storageRef).then((response) => {
        console.log(response)
    })
};

export const get_img_list = () => {
    const storage = getStorage();
    const storageRef = storage_ref(storage,"/files");
    listAll(storageRef).then((response) => {
        console.log(response)
    })
};