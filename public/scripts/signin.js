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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.

     // window.location.href='/'
    } else {
      // No user is signed in.
    }
  });


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

socket.on('valid')


socket.on('errors',function(error){
    console.log(`error recido: ${error}`)
    var err = document.querySelector('#error-display');
    err.classList.remove("error-false");
    err.classList.add('error-true');
    err.innerHTML=error;
})


socket.on('succeful-signIn',function(data){
    console.log(data);
   
    firebase.auth().signInWithCustomToken(data).then(function(userRecord){
      
        
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          // Send token to your backend via HTTPS
          console.log("id refresh: "+idToken)
          var form = document.querySelector('#signin-form');
          form.setAttribute('action',`/signin/${idToken}`);
          //form.submit();
       //   
          // ...
        }).catch(function(error) {
          // Handle error
          socket.emit('pedo',error);
        });
       // window.location.href="/";
    })
     .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });

     // https://stackoverflow.com/questions/49722324/firebase-getidtoken-not-working
   
})


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      console.log(user); // It shows the Firebase user
      console.log(firebase.auth().user); // It is still undefined
      user.getIdToken(false).then(function(idToken) {  // <------ Check this line
         console.log("id token false: "+idToken); // It shows the Firebase token now
         var form = document.querySelector('#signin-form');
         form.setAttribute('action',`/signin/${idToken}`);
        form.submit();
         
      });
  }
});

