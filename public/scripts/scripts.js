

const socket = io("localhost:3000");

const config={
    apiKey: "AIzaSyDOzLfPupVQqP5RqQOR4JvWsZaxqYV52Ws",
    authDomain: "bettingsite-46549.firebaseapp.com",
    databaseURL: "https://bettingsite-46549.firebaseio.com",
    projectId: "bettingsite-46549",
    storageBucket: "bettingsite-46549.appspot.com",
    messagingSenderId: "173582190949",
    appId: "1:173582190949:web:f2cb094ce08848494b398c"
};

firebase.initializeApp(config);

var name = 'anfer';


document.querySelector('#signOut-button').addEventListener('click',async function(e){
    e.preventDefault();
    
await firebase.auth().signOut()
    console.log(firebase.auth().currentUser);
     document.querySelector('#signOut-form').submit();
})


function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

 