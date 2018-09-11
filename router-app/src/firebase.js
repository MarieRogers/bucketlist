import firebase from 'firebase';
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDITwnsCq6AHjq6n3xWC7MCfipGlqqf2FM",
    authDomain: "vue-bucket-list.firebaseapp.com",
    databaseURL: "https://vue-bucket-list.firebaseio.com",
    projectId: "vue-bucket-list",
    storageBucket: "vue-bucket-list.appspot.com",
    messagingSenderId: "722001435501"
};

var firebaseApp = firebase.initializeApp(config);

export const db = firebaseApp.database();