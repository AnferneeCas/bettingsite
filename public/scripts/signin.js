
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
const auth = firebase.auth();

firebase.auth().onAuthStateChanged(function(firebaseUser){
    if(firebaseUser){
             
//     window.location.href="/"

    }else{
        
        var database = firebase.database();
         var btnLogin= document.querySelector(".btn");
        btnLogin.addEventListener('click',function(e){
             e.preventDefault();
            var username= document.querySelector("#InputUsername").value;
            var email = document.querySelector("#InputEmail").value;
            var password = document.querySelector("#InputPassword").value;
    
                const promise = auth.createUserWithEmailAndPassword(email,password).then(function(user){
            
                    writeUserData(user.user.uid,username,email).then(function(){
                       // window.location.href = "/";
                    });
    
    
                });
             promise.catch(e=>console.log(e.message));
           

            

    })


    }
})




// NOTE ADD CATPCHA TO PREVENT SIGN IN SPAMMING




function writeUserData(userId, username, email, imageUrl) {
    
  var promise=  firebase.database().ref('users/' + username ).set({
        userId: userId,
        username: username,
        email: email
      //some more user data
    });


    var promise= firebase.database().ref('usernames'+username)+set({

    })  
 
    return promise;
  }

