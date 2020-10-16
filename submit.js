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
    var responseKey = newPostKey.substr(1);
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
            // invoke php on the server to in turn invoke python
            var xmlhttp = new XMLHttpRequest();
            var str = "/Sample.php?DocId="+responseKey;
            console.log(str);
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    //alert(alertText);
                    var postId = responseKey;
                    firebase.database().ref('ResponseFrequencies/' + postId).orderByKey().once('value').then(function(snapshot) {
                        var value = (snapshot.val()) || 'Error';
                        console.log("Frequency : ")
                        console.log(value);
                        var responseFormatted = parseResponseAndGetDict(value);
                        document.getElementById("response-area").innerHTML = '<pre>' + JSON.stringify(responseFormatted) + '</pre>';
                        document.getElementById('textForm').reset();
                    });
                }
            }
            xmlhttp.open("GET", str );
            xmlhttp.send();
        }
    });

}
  
// Function to get get form values
function getInputVal(id){
return document.getElementById(id).value;
}

function ncdf(x, mean, std) {
    var x = (x - mean) / std;
    var t = 1 / (1 + .2315419 * Math.abs(x));
    var d =.3989423 * Math.exp( -x * x / 2);
    var prob = d * t * (.3193815 + t * ( -.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if( x > 0 ) prob = 1 - prob;
    return prob;
}

function parseResponseAndGetDict(response) {
    var responseDict = { };
    for (var elements in response) {
        console.log(elements);
        var arr = [];
        var flag = false;
        for (var words in response[elements]) {
            flag = true;
            arr.push(response[elements][words]);
        }
        if(flag) {
            responseDict[elements] = arr;
        }
    }
    return responseDict;
}