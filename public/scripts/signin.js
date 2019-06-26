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



var signInButton = document.querySelector('#signin-button');
signInButton.addEventListener('click',function(e){
    e.preventDefault();
    var username = document.querySelector('#InputUsername').value;
    var email = document.querySelector('#InputEmail').value;
    var password = document.querySelector('#InputPassword').value;
    var user ={
        username:username,
        email:email,
        password:password,
    };
    socket.emit('signIn',user);
})



socket.on('errors',function(error){
    console.log(`error recido: ${error}`)
    var err = document.querySelector('#error-display');
    err.classList.remove("error-false");
    err.classList.add('error-true');
    err.innerHTML=error;
})


socket.on('succeful-signIn',function(data){
    console.log(data);
   
    firebase.auth().signInWithCustomToken(data).then(function(){
        window.location.href="/";
    })
     .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });


   
})