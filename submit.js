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
                        var [responseFormatted, responseFontSizes] = parseResponseAndGetFontSizes(value);
                        var frequencies = Object.keys(responseFontSizes);
                        for (var i in responseFontSizes) {
                            var currFontSizes = responseFontSizes[i];
                            var currWords = responseFormatted[i];
                            console.log(document.getElementById("response-area").innerHTML);
                            var string = document.getElementById("response-area").innerHTML + '<div style=\"width: 90%; display:inline-block; font-size: ' + Math.ceil(currFontSizes).toString() + 'px\">' ;
                            for (var word in currWords) {
                                console.log(currWords[word]);
                                string = string + " " + currWords[word];
                            }
                            string = string +'</div> \n';
                            document.getElementById("response-area").innerHTML = string;
                        }
                        document.getElementById('textForm').reset();
                        console.log("Mean = "+ mean);
                        console.log("STD = "+ std);
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

var mean;
var std;

function ncdf(x, mean, std) {
    var x = (x - mean) / std;
    var t = 1 / (1 + .2315419 * Math.abs(x));
    var d =.3989423 * Math.exp( -x * x / 2);
    var prob = d * t * (.3193815 + t * ( -.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if( x > 0 ) prob = 1 - prob;
    return 1 - prob;
}

function parseResponseAndGetFontSizes(response) {
    var responseDict = { };
    var lengths = [];
    var totalWords = 0;
    var responseFontSizes = { };
    for (var elements in response) {
        //console.log(elements);
        var arr = [];
        var flag = false;
        for (var words in response[elements]) {
            flag = true;
            arr.push(response[elements][words]);
        }
        if(flag) {
            responseDict[elements] = arr;
            lengths.push(arr.length);
            console.log(arr.length);
            totalWords = totalWords + arr.length;
        }
    }
    mean = totalWords/lengths.length;
    std = getStandardDeviation(lengths);
    var keys = Object.keys(responseDict);
    for(var i in lengths) {
        console.log("Font size for words with frequency "+ keys[i] + " = " + Math.max(15, (40*(ncdf(lengths[i],mean, std)))));
        responseFontSizes[keys[i]] = Math.max(15, (40*(ncdf(lengths[i],mean, std))));
    }
    return [responseDict, responseFontSizes];
}

function getStandardDeviation (array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  }