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

var logInButton = document.querySelector('#login-button');
logInButton.addEventListener('click',function(e){
    e.preventDefault();
    var email = document.querySelector('#InputEmail').value;
    var password = document.querySelector('#InputPassword').value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        displayError(error.message);
                // ...
      }).then(function(){

var user = firebase.auth().currentUser
    if (user) {
        console.log(user); // It shows the Firebase user
        console.log(firebase.auth().user); // It is still undefined
        user.getIdToken(true).then(function(idToken) {  // <------ Check this line
           console.log("id token false: "+idToken); // It shows the Firebase token now
           var form = document.querySelector('#login-form');
           form.setAttribute('action',`/login/${idToken}`);
           form.submit();
           
        });
    }else{
        displayError('Something went wrong, please refresh the website');
    }
  });
      
})

function displayError(error){
    var err = document.querySelector('#error-display');
        err.classList.remove("error-false");
        err.classList.add('error-true');
        err.innerHTML=error;
};




  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }
  
