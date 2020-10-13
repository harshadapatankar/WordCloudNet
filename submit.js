// Initialize Firebase (ADD YOUR OWN DATA)
var firebaseConfig = {
    apiKey: "AIzaSyDztnNjfhUtjVtLxi9kv0SjkH03uCGMQxw",
    authDomain: "wordcloud-3e528.firebaseapp.com",
    databaseURL: "https://wordcloud-3e528.firebaseio.com",
    projectId: "wordcloud-3e528",
    storageBucket: "wordcloud-3e528.appspot.com",
    messagingSenderId: "340398309853",
    appId: "1:340398309853:web:2398232dd10c6598ecb634",
    measurementId: "G-KV81F05JRP"
};
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
    alert("Document Submitted");
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
    db.collection("users").add({
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