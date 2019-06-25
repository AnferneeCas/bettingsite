
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

firebase.auth().onAuthStateChanged(function(firebaseUser){
    if(firebaseUser){
        window.location.href="/";
    }
    else{
        var btnLogin= document.querySelector(".btn");
        btnLogin.addEventListener('click',function(e){
            e.preventDefault();
            
            var email = document.querySelector("#InputEmail").value;
            var password = document.querySelector("#InputPassword").value;
            const auth = firebase.auth();
            const promite = auth.signInWithEmailAndPassword(email,password).then(function(value){
                window.location.href = "/";
            });
            promite.catch(e=>console.log(e.message));

        })

         
      }
})



