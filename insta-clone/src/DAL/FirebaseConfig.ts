import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth ,GoogleAuthProvider} from "firebase/auth";
//                                                ::::::::::::::::::::::CONFIG THE FIREBASE::::::::::::::::::::::::::

//Here is the config file of Firebase SDK to allow the functions use Firebase_instance object
export const firebaseConfig = {
    apiKey: "AIzaSyBZoW7Tcp26aJ_7_zDEuMO9hDUzfiJxv8M",
    authDomain: "messenger-40cc4.firebaseapp.com",
    projectId: "messenger-40cc4",
    storageBucket: "gs://messenger-40cc4.appspot.com",
    messagingSenderId: "856002256521",
    databaseURL: "https://messenger-40cc4-default-rtdb.europe-west1.firebasedatabase.app/",
    appId: "1:856002256521:web:0be5cbb812449f12b93058",

};
//INITIALIZE FIREBASE
export const firebase = initializeApp(firebaseConfig);

//Initializing the Firebase instance and creating Firebase auth object then initializing GoggleAuthProvider Object
export const Firebase_auth =  getAuth();



//INITIALIZING FIRESTORE INSTANCE;port 
export const Firestore = getFirestore(firebase);

//Initialize Real-time data base instance 
export const dataBase = getDatabase(firebase);

//Google Provider
export const google_provider = new GoogleAuthProvider();