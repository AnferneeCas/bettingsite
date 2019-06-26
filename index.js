var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var port = process.env.PORT || 3000;
var socketio = require("socket.io");

var better = [{ better2x: [] }, { better3x: [] }, { better10x: [] }];
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);

//FIREBASE STUFF

var admin = require("firebase-admin");
var serviceAccount = require(__dirname +
  "/bettingsite-35e9c-firebase-adminsdk-u7zyw-6567587c93.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bettingsite-35e9c.firebaseio.com"
});

var db = admin.database();

app.get("/", function(req, res) {
    console.log(req.cookies);
  res.render("index.html");
  
});

app.get("/login", function(req, res) {
    if(req.cookies.token !=null){
        admin.auth().verifyIdToken(req.cookies.token)
        .then(function(decodedToken) {
          var uid = decodedToken.uid;
          console.log(`DECODED TOKEN: ${decodedToken}`);
          // ...
        }).catch(function(error) {
          // Handle error
          console.log(`error decoding ${error}`);
        });
    }
   
  res.render("login.html");
});
app.get("/signin", function(req, res) {
  res.render("signin.html");
});

const expressServer = app.listen(port);
const io = socketio(expressServer);
startTimer(10);
io.on("connection", function(socket) {
  // SOCKETS SIGN IN

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
                console.log(customToken);
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
});

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
