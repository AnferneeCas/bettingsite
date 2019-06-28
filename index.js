var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var port = process.env.PORT || 3000;
var socketio = require("socket.io");
var bodyParser = require('body-parser');
var better = [{ better2x: [] }, { better3x: [] }, { better10x: [] }];
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);
app.use(bodyParser.urlencoded({extended:true}));

var signinRoutes = require('./routes/signin.js');
app.use(signinRoutes);
//FIREBASE STUFF
const {admin}= require('./routes/firebaseconfig.js');

var db = admin.database();

app.get("/", function(req, res) {
    //console.log(req.cookies);
  res.render("index.html");
  
});

app.get("/login", function(req, res) {
  console.log("SESSION COOKIES LOGIN");
  console.log(req.cookies.session);

  const sessionCookie = req.cookies.session || '';
    if(sessionCookie !=''||sessionCookie!=null){
      admin.auth().verifySessionCookie(
        sessionCookie, true /** checkRevoked */)
        .then((decodedClaims) => {
          res.redirect('/');
        })
        .catch(error => {
          // Session cookie is unavailable or invalid. Force user to login.
          console.log(error);
          res.render('logic.html');

        });
    }else{
      res.render('logic.html');
    }
   
 // res.render("login.html");
});
// app.get("/signin", function(req, res) {
//   res.render("signin.html");
// });

// app.post('/signin/:idToken',function(req,res){
//  // console.log(req.params.idToken.toString());
//   const expiresIn = 60 * 60 * 24 * 5 * 1000;
//   // Create the session cookie. This will also verify the ID token in the process.
//   // The session cookie will have the same claims as the ID token.
//   // To only allow session cookie setting on recent sign-in, auth_time in ID token
//   // can be checked to ensure user was recently signed in before creating a session cookie.
//   admin.auth().createSessionCookie(req.params.idToken.toString(), {expiresIn})
//     .then((sessionCookie) => {
//      // Set cookie policy for session cookie.
//      const options = {maxAge: expiresIn, httpOnly: true, secure: true};
//      res.cookie('session', sessionCookie,options);
//      console.log("SESION COOKRIR"+sessionCookie,options) ;
//      res.cookie('test','test' );
//      res.redirect('/');
//     }, error => {
//      console.log("Error creando cookie");
//      res.redirect('/signin');
//     });
// });

const expressServer = app.listen(port);
const io = socketio(expressServer);
startTimer(10);
io.on("connection", function(socket) {
  // SOCKETS SIGN IN
  socket.on('pedo',function(error){
    console.log("HAY PEDO: "+error);
  })
  socket.on("signIn", function(user) {
    //Sign In event
    // create reference to save username    
    var ref = db.ref("usernames/");

    //checks if username is alreade use
    ref.once("value").then(function(snapshot) {
      if(snapshot.child(user.username).exists()){
            //if username already exist return and error event
            socket.emit('errors',"Username already exists");
      }
      else{
          //if username is unique, proceeds to createUser
        admin.auth().createUser({
          email: user.email,
          emailVerified: false,
          password: user.password,
          displayName: user.username,
          disabled: false
        })
        .then(function(userRecord) {
          //if user is create succefully proceeds to store the user username
          var ref = db.ref(`usernames/${user.username}`);
          ref.set({
            uid: userRecord.uid
          }).then(function(user){
               console.log(`Username ${user.username} stored succefully`);
          }).catch(function(error){
              console.log(`Something happened when storing the username: ${user}`);
          });
          console.log("Successfully created new user:", userRecord.uid);

          //if everything went right proceeds to send the apikey to the clients cookies
          let uid = 'some-uid';

            admin.auth().createCustomToken(userRecord.uid)
            .then(function(customToken) {
                // Send token back to client
               // console.log(customToken);
             socket.emit('succeful-signIn',customToken);
            })
            .catch(function(error) {
                console.log('Error creating custom token:', error);
            });
          

        }).catch(function(error){
            //if an error occurs sends the error message to the client
           socket.emit('errors',error.errorInfo.message);
        });
      }
    });

   
  });

  socket.on('session-cookies',function(idToken){
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  admin.auth().createSessionCookie(idToken, {expiresIn})
    .then((sessionCookie) => {
     // Set cookie policy for session cookie.
     const options = {maxAge: expiresIn, httpOnly: true, secure: true};
     socket.emit('session',sessionCookie);
      
    }, error => {
     console.log("Error creando cookie");
    });
});
 

  console.log(`user Connected: ${socket.id}`);
  socket.emit("loadBets", better);

  socket.on("betX2", function(name, amount) {
    io.emit("newBet2x", name, amount);
    better[0].better2x.push({ name: name, amount: amount });
  });

  socket.on("betX3", function(name, amount) {
    io.emit("newBet3x", name, amount);
    better[1].better3x.push({ name: name, amount: amount });
  });

  socket.on("betX10", function(name, amount) {
    io.emit("newBet10x", name, amount);
    better[2].better10x.push({ name: name, amount: amount });
  });

}) 

function startTimer(duration) {
  var timer = duration,
    minutes,
    seconds;
  var interval = setInterval(function() {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? minutes : minutes;
    seconds = seconds < 10 ? seconds : seconds;

    var time = "Timer: " + minutes + ":" + seconds;

    io.emit("tick", time);

    if (--timer < 0) {
      timer = duration;
      clearInterval(this);
      selectWinner();
    }
  }, 1000);
}

function selectWinner() {
  io.emit("rotate");
  setTimeout(function() {
    startTimer(10);
    console.log("empezo");
  }, 10000);
}

