
var documetId = null;
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

// Listen for form submit
document.getElementById('textForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
    e.preventDefault();
    // push a new child and get new key
    var newPostKey = firebase.database().ref().child("TextData").push().key;
    // Get values
    var myText = getInputVal('text');
    
    var alertText = "";

    // Save message in firebase reatime DB
    firebase.database().ref('TextData/' + newPostKey).set({
        text: myText,
    }, function(error) {
        if (error) {
            // The write failed...
            alertText += "Error in submitting Data";
            alert(alertText);
            return "failed";
        } else {
            // Data saved successfully!
            alertText += "Text Submitted";
        }
    });
    document.getElementById('textForm').reset();
    return newPostKey;
}
  
// Function to get get form values
function getInputVal(id){
return document.getElementById(id).value;
}