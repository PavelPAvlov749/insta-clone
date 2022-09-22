import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth ,GoogleAuthProvider} from "firebase/auth";
//                                                ::::::::::::::::::::::CONFIG THE FIREBASE::::::::::::::::::::::::::

//Here is the config file of Firebase SDK to allow the functions use Firebase_instance object
export const firebaseConfig = {
    apiKey: "AIzaSyBat-YL7LctaH5CRu3TzdWWlXSvPB41bEs",
    authDomain: "insta-clone-30755.firebaseapp.com",
    databaseURL: "https://insta-clone-30755-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "insta-clone-30755",
    storageBucket: "gs://insta-clone-30755.appspot.com",
    messagingSenderId: "281434029671",
    appId: "1:281434029671:web:9c5edda7987815648bdec2"
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