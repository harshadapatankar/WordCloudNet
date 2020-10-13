//import * as firebase from 'firebase';
//import 'firebase/firestore';
//const firebase = require();
// // Required for side-effects
// Initialize Firebase (ADD YOUR OWN DATA)
//const firebase = require("firebase");
// Required for side-effects

//var serviceAccount = require(["Scripts/wordCloudEnv/Scripts/wordcloud-firebase-secretkey.json"]);

var firebaseConfig = {
    //credential: admin.credential.cert(serviceAccount),
    apiKey: "AIzaSyDztnNjfhUtjVtLxi9kv0SjkH03uCGMQxw",
    authDomain: "wordcloud-3e528.firebaseapp.com",
    databaseURL: "https://wordcloud-3e528.firebaseio.com",
    projectId: "wordcloud-3e528",
    storageBucket: "wordcloud-3e528.appspot.com",
    messagingSenderId: "340398309853",
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();
var db = firebase.firestore()
// Reference messages collection
var textDBref = db.collection('TextData');

// Listen for form submit
document.getElementById('textForm').addEventListener('submit', submitForm);
  
  // Submit form
function submitForm(e){
    e.preventDefault();
    // Get values
    var myText = getInputVal('text');
    // Save message
    saveMessage(myText);
    // Show alert
    document.querySelector('.alert').style.display = 'block';
    // Hide alert after 3 seconds
    //setTimeout(function(){
    //    document.querySelector('.alert').style.display = 'none';
    //},3000);
    // Clear form
    document.getElementById('textForm').reset();
}
  
// Function to get get form values
function getInputVal(id){
return document.getElementById(id).value;
}
  
// Save message to firebase
function saveMessage(text){
    // Add a second document with a generated ID.
    textDBref.add({
        text: text,
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        return docRef.id
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}