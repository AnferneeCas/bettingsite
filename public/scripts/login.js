const socket = io("localhost:3000");


const config={
    apiKey: "AIzaSyAI5ILudjYnFkpf8WAPAYvrt-mqu3WhxmM",
    authDomain: "bettingsite-35e9c.firebaseapp.com",
    databaseURL: "https://bettingsite-35e9c.firebaseio.com",
    projectId: "bettingsite-35e9c",
    storageBucket: "",
    messagingSenderId: "976960596080",
    appId: "1:976960596080:web:7fd81ff97ba0017e" 
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
      });
})

function displayError(error){
    var err = document.querySelector('#error-display');
        err.classList.remove("error-false");
        err.classList.add('error-true');
        err.innerHTML=error;
};


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user); // It shows the Firebase user
        console.log(firebase.auth().user); // It is still undefined
        user.getIdToken(true).then(function(idToken) {  // <------ Check this line
           console.log("id token false: "+idToken); // It shows the Firebase token now
           var form = document.querySelector('#login-form');
           form.setAttribute('action',`/login/${idToken}`);
           form.submit();
           
        });
    }
  });
  
