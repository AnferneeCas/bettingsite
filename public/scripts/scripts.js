

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

var name = 'anfer';


document.querySelector('#signOut-button').addEventListener('click',function(e){
    e.preventDefault();
    firebase.auth().signOut();
    document.querySelector('#signOut-form').submit();
})


function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }