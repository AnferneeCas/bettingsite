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
     
    })
     .catch(function(error) {
        // Handle Errors here.
        console.log(error)
        var err = document.querySelector('#error-display');
        err.classList.remove("error-false");
        err.classList.add('error-true');
        err.innerHTML='Unknown error, please contact the support team';
          // ...
      });

   
   
})


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      console.log(user); // It shows the Firebase user
      console.log(firebase.auth().user); // It is still undefined
      user.getIdToken(true).then(function(idToken) {  // <------ Check this line
         console.log("id token false: "+idToken); // It shows the Firebase token now
         var form = document.querySelector('#signin-form');
         form.setAttribute('action',`/signin/${idToken}`);
        form.submit();
        
      });
  }
});

