const config={
    apiKey: "AIzaSyAI5ILudjYnFkpf8WAPAYvrt-mqu3WhxmM",
    authDomain: "bettingsite-35e9c.firebaseapp.com",
    databaseURL: "https://bettingsite-35e9c.firebaseio.com",
    projectId: "bettingsite-35e9c",
    storageBucket: "",
    messagingSenderId: "976960596080",
    appId: "1:976960596080:web:7fd81ff97ba0017e" 
};

var logInButton = document.querySelector('#log-in');
var signOutButton= document.querySelector("#sign-out");
var signInButton = document.querySelector("#sign-in");
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(firebaseUser){
    if(firebaseUser){
        console.log(firebaseUser);
        console.log("dquuuu");
      
       signOutButton.classList.remove('disable');

       
       logInButton.classList.add('disable');
       signInButton.classList.add('disable');
       
       signOutButton.addEventListener('click',function(e){
           e.preventDefault();
           firebase.auth().signOut();
           window.location.href = "/";
       })

    }else{
        logInButton.classList.remove('disable');
        signInButton.classList.remove('disable');
        
    }
})