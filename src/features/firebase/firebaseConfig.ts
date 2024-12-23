import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const {
    VITE_Api_Key,
    VITE_Auth_Domain,
    VITE_Database_URL,
    VITE_Project_Id,
    VITE_Storage_Bucket,
    VITE_Messaging_Sender_Id,
    VITE_App_Id
} = import.meta.env;

const firebaseConfig = {
    apiKey: VITE_Api_Key,
    authDomain: VITE_Auth_Domain,
    databaseURL: VITE_Database_URL,
    projectId: VITE_Project_Id,
    storageBucket: VITE_Storage_Bucket,
    messagingSenderId: VITE_Messaging_Sender_Id,
    appId: VITE_App_Id
};

const App = initializeApp(firebaseConfig)

export const auth = getAuth(App)
export const db = getFirestore(App);

export default App;