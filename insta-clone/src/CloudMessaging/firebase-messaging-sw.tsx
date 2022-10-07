import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  apiKey: "AIzaSyBat-YL7LctaH5CRu3TzdWWlXSvPB41bEs",
  authDomain: "insta-clone-30755.firebaseapp.com",
  databaseURL: "https://insta-clone-30755-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "insta-clone-30755",
  storageBucket: "insta-clone-30755.appspot.com",
  messagingSenderId: "281434029671",
  appId: "1:281434029671:web:9c5edda7987815648bdec2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app)

const token = getToken(messaging,{vapidKey : "BMwFQe-Agl4iBwoGWRFyBAcnX8yKSVZxToGB1YGKnXSWO2VLkcNktXxL_J0hDdgLJj1TRyEhlpv-vZyEsy0UV_g"}).then((token) => {
    if(token){
        alert("Token valid")
    }else{
        console.log("No token available")
    }
}).catch((error) => {
    console.error(error)
})

console.log(token)

function requestPremission () {
    Notification.requestPermission().then((premission) => {
        if(premission === "granted") {
            console.log("OK")
        }else{
            console.log("Premission not granted")
        }
    })
}

