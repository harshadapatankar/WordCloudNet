
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
            var str = "http://2cd7d7d.online-server.cloud/Sample.php?DocId="+responseKey;
            console.log(str);
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    //alert(alertText);
                    var postId = responseKey;
                    firebase.database().ref('GlobalWordCounts/').orderByKey().once('value').then(function(snapshot) {
                        var GlobalVal = (snapshot.val()) || 'Error';
                        console.log(GlobalVal)
                    firebase.database().ref('ResponseFrequencies/' + postId).orderByKey().once('value').then(function(snapshot) {
                        var value = (snapshot.val()) || 'Error';
                        console.log("Frequency : ")
                        console.log(value);
                        var [responseFormatted, responseFontSizes, frequencyColor, localWordCountDict] = parseResponseAndGetFontSizes(value);
                        console.log(localWordCountDict);
                        
                        var canvas = document.getElementById("canvas");
		                var context = canvas.getContext('2d');

                        console.log(frequencyColor);
                        
                        canvas.width = 1000;
		                canvas.height = 1000;

                        var area = new binpacking.Rect(450,450,700,700);

                        //debug.html
                        var rects = [];
                        //Object.entries(responseFormatted).forEach(([key, val]) => console.log(key, val));
                        
                        
                        for (var key in localWordCountDict){
                            console.log("i:"+responseFontSizes[key]);
                            var currWord = key;
                            var currFontSizes = responseFontSizes[localWordCountDict[key]];
                            // Measure the word's size
                            context.font = currFontSizes + "px Times New Roman";
                            context.textAlign = "center";
                            var wordWidth = context.measureText(currWord).width;

                            // Place all the words randomly
                           var rect = new binpacking.Rect(450,450,wordWidth+2,currFontSizes+2);


                            // Store some meta-information
                            rect.addProperty("fontSize", currFontSizes);
                            rect.addProperty("text", currWord);
                            rect.addProperty("freq", localWordCountDict[key])

                            rects.push(rect);

                        } 
                        var placedRects = binpacking.pack(area, rects, 5);
                        console.log(placedRects)
                        canvas.onmousemove = function(e) {

                            // important: correct mouse position:
                            var rec = this.getBoundingClientRect(),
                                x = e.clientX - rec.left,
                                y = e.clientY - rec.top,
                                i = 0, r;
                            
                            //context.clearRect(0, 0, canvas.width, canvas.height); // for demo
                             
                            while(r = placedRects[i++]) {
                              // add a single rect to path:
                              context.beginPath();
                              context.rect(r.left, r.top, r.width, r.height);

                              
                              // check if we hover it, fill red, if not fill it blue
                              if (context.isPointInPath(x, y))
                              {
                                context.strokeStyle = "#FF0000"; 
                                context.strokeRect(r.left , r.top, r.width , r.height );
                                context.font = fontSize/10 + "px Calibri";
                                context.fillText(placedRects[i-1].getProperty("freq"),r.right + 5 ,r.bottom + 5);
                              
                              } 
                              else{
                                context.strokeStyle = "#FFFFFF"; 
                                context.strokeRect(r.left , r.top , r.width , r.height );
                                
                              }
                              
                            }  
                        }
                        // Draw the text into each rect
                        context.fillStyle = "#000";
                        for (var i = 0;i < placedRects.length;i++){
                            var fontSize = placedRects[i].getProperty("fontSize");
                            context.font = fontSize + "px Times New Roman";
                            //context.translate(canvas.width, canvas.height);
                            //context.rotate(Math.PI / 2);
                            context.fillText(placedRects[i].getProperty("text"), placedRects[i].x, placedRects[i].y + fontSize/4);
                            context.fillStyle = frequencyColor[placedRects[i].getProperty("freq")];
		}
                        
                        
                    }); });
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
    var localWordCountDict = { };
    var lengths = [];
    var totalWords = 0;
    var responseFontSizes = { };
    var colorsBasedOnFrequency = { };
    // calculate mean, and display certail imp words only
    for (var elements in response) {
        //console.log(elements);
        var arr = [];
        var flag = false;
        for (var words in response[elements]) {
            flag = true;
            arr.push(response[elements][words]);
        }
        if(flag) {
            lengths.push(arr.length);
            console.log(arr.length);
            totalWords = totalWords + arr.length;
        }
    }
    var meanOfWords = totalWords/lengths.length;
    var frequencies = [];
    var totalOfFrequencies = 0;
    for (var elements in response) {
        if( response[elements].length < meanOfWords) {
            var arr = [];
            var flag = false;
            for (var words in response[elements]) {
                flag = true;
                arr.push(response[elements][words]);
                localWordCountDict[response[elements][words]]=elements;
            }
            if(flag) {
                responseDict[elements] = arr;
                frequencies.push(parseInt(elements));
                console.log(elements);
                totalOfFrequencies = totalOfFrequencies + parseInt(elements);
            }
        }
    }
    console.log("freq:"+frequencies);
    
    mean = totalOfFrequencies/frequencies.length;
    std = getStandardDeviation(frequencies);
    console.log("Debug = "+ totalOfFrequencies + " " + mean + " " + std);
    var keys = Object.keys(responseDict);
    for(var i in frequencies) {
        console.log("Font size for words with frequency "+ keys[i] + " = " + Math.max(10, (100*(1-ncdf(frequencies[i],mean, std)))));
        responseFontSizes[keys[i]] = Math.max(10,(100*(1-ncdf(frequencies[i],mean, std))));
        colorsBasedOnFrequency[keys[i]] = colorExtract(1-ncdf(frequencies[i],mean, std*2));
    }
    return [responseDict, responseFontSizes, colorsBasedOnFrequency, localWordCountDict];
}
    

function getStandardDeviation (array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}


//This is a special-case, not a generic solution, but by simply doing a linear gradient between hues and scrunching the blend in the middle range (i.e. the green) you can get a reasonable approximation without color stepping:
// reference https://stackoverflow.com/questions/16399677/set-background-color-based-on-outdoor-temperature
function colorExtract(t)
{
    var a = Math.max(0.5, (t+0.5)/1.5);
    // Scrunch the green/cyan range in the middle
    var sign = (a < .5) ? -1 : 1;
    a = sign * Math.pow(2 * Math.abs(a - .5), .35)/2 + .5;
    // Linear interpolation between the cold and hot
    var h0 = 259;
    var h1 = 12;
    var h = (h0) * (1 - a) + (h1) * (a);
    var rgb = HSVtoRGB(h, 0.65, 0.75);
    var color = "rgb("+rgb['r'].toString()+","+rgb['g'].toString()+","+rgb['b'].toString()+")";
    return color;
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        'r': Math.round(r * 255),
        'g': Math.round(g * 255),
        'b': Math.round(b * 255) };
}

jQuery(document).ready(function() {
    $('#response-area ul:first-child > li').hover(function() {
        $(this).children("ul").slideToggle('slow');
    });
    
    $('#response-area ul:not(:first-child) > li').click(function(){
        $(this).children("ul").slideToggle('slow');
    });
});