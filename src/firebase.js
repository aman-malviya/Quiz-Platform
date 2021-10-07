import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBsYSWWClIrW-wI7ItH1vplMxcchaezYQI",
  authDomain: "edifyonline.live",
  projectId: "quiz-app-5505a",
  storageBucket: "quiz-app-5505a.appspot.com",
  messagingSenderId: "460190303790",
  appId: "1:460190303790:web:9a641e9c6d55ad976641bf",
  measurementId: "G-QQQ7077NLD"
});
export const db = firebaseApp.firestore();
export const auth = firebase.auth();
var googleProvider = new firebase.auth.GoogleAuthProvider();
export default firebaseApp;
export {googleProvider}
