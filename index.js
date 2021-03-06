var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var port = process.env.PORT || 3000;
var socketio = require("socket.io");
var bodyParser = require("body-parser");
var betsBlack=[];
var betsRed=[];
var betsYellow=[];
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
var acceptBets=true;
var  tableClass= require("./routes/bets");
var table = new tableClass();
var signinRoutes = require("./routes/signin.js");
var loginRoutes = require("./routes/login.js");
var pricesRoutes = require("./routes/prices.js");
var games = require("./routes/gamesKeys.js");
var crypto= require('crypto');
var sha256 = require('js-sha256');
app.use(signinRoutes);
app.use(loginRoutes);
app.use(pricesRoutes);
app.use(games);
var nodemailer = require('nodemailer');

//HASHING

var salt=null;
var hash = null;



//FIREBASE STUFF
const { admin } = require("./routes/firebaseconfig.js");

var db = admin.database();

function resetLoadBets(){
  betsBlack=[];
  betsRed=[];
  betsYellow=[];

  console.log('RESET: '+JSON.stringify(betsBlack));
}
app.get("/", async function(req, res) {
  console.log(req.cookies);
  try {
    var result=await admin
  .auth()
  .verifySessionCookie(req.cookies.session, true /** checkRevoked */)
  
  
    res.render("index.html")
  
   
  } catch (error) {
    res.render("login.html") 
  }
  
   
  
  
 
});

app.get('/store',function(req,res){
  var ref = db.ref("games");
  ref.on("value", function(snapshot) {
    
    var arr=[];
    snapshot.forEach(function(data){
     // console.log(data.val());
      arr.push({id:data.key,name:data.val().name,price:data.val().price});
    })
   // console.log(arr);
    res.render('store.ejs',{games:arr});
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
})

  app.get('/coins',function(req,res){
    var ref = db.ref("prices");
    ref.on("value", function(snapshot) {
      
      var arr=[];
      snapshot.forEach(function(data){
       // console.log(data.val());
        arr.push({price:data.key,amountCoins:data.val().amountCoins});
        
      })
     // console.log(arr);
      res.render('store.ejs',{games:arr});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  });


app.post("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});

const expressServer = app.listen(port);
const io = socketio(expressServer);
startTimer(30);
io.on("connection", function(socket) {
  //GETTING USERS COINS
  socket.on('purchase',function(id,sessionCookie){
      console.log(id);
    
      

      admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(decodedClaims => {

        
        var value = db.ref(`games/${id}`);
        value.once('value').then(function(snapshot){
          if(snapshot.val()!=null)
            return snapshot.val().price;
        }).then(function(gamePrice){
            console.log("Price: "+ gamePrice);

            var upvotesRef = db.ref(`coins/${decodedClaims.uid}/coins`);
        upvotesRef.transaction(function (current_value) {
          
              if(current_value!=null){
                if(gamePrice!=null && current_value>=gamePrice){
                  return current_value - gamePrice;
                }
                else{
                  return ;
                }

                
               
              }else{
                console.log('else');
                return current_value;
              }
          },(function(error, committed,snapshot){

              // console.log(error);
              // console.log(committed);
              // console.log(snapshot);
              if(error!=null){
                console.log("Error perron");
                socket.emit('purchase-error',"UNEXPECTED ERROR,please contact the support team");
              }else if(!committed){
                console.log("commited false");
                socket.emit('purchase-error',"You dont have enough coins to buy this game");
              }else if(committed){
                console.log("emmited");
                socket.emit('purchase-succeful',"Thanks for your purchase!");
                storeEmail();
              }
                   
          })
        )})

        
      });
   
  })
  socket.on("getCoins", function(sessionCookie) {
    admin
      .auth()
      .verifySessionCookie(sessionCookie, false /** checkRevoked */)
      .then(decodedClaims => {
       // console.log(`UID GETCOINS:     ` + JSON.stringify(decodedClaims));

        var ref = db.ref(`coins/${decodedClaims.uid}`);

        //checks if username is alreade use
        ref.once("value").then(
          function(snapshot) {
            //console.log(snapshot);
            if (snapshot.val() != null) {
              console.log("COINSSSSSSSS");
              socket.emit("updateCoins", snapshot.val().coins);
            }
            //console.log('DATA SNAPSHOT:       '+snapshot.val().coins);
          },
          function(error) {
            console.log(error);
          }
        );
      })
      .catch(error => {
        // Session cookie is unavailable or invalid. Force user to login.
        console.log(error);
       // res.render("login.html");
      });
  });

  // SOCKETS SIGN IN

  socket.on("signIn", function(user) {
    //Sign In event
    // create reference to save username
    var ref = db.ref("usernames/");

    //checks if username is alreade use
    ref.once("value").then(function(snapshot) {
      if (snapshot.child(user.username).exists()) {
        //if username already exist return and error event
        socket.emit("errors", "Username already exists");
      } else {
        //if username is unique, proceeds to createUser
        admin
          .auth()
          .createUser({
            email: user.email,
            emailVerified: false,
            password: user.password,
            displayName: user.username,
            disabled: false
          })
          .then(function(userRecord) {
            //if user is create succefully proceeds to store the user username
            var ref = db.ref(`usernames/${user.username}`);
            ref
              .set({
                uid: userRecord.uid
              })
              .then(function(user) {
               // console.log(`Username ${user.username} stored succefully`);
              })
              .catch(function(error) {
              //  console.log(
                //   `Something happened when storing the username: ${user}`
                // );
              });
            //console.log("Successfully created new user:", userRecord.uid);

            var ref2 = db.ref(`coins/${userRecord.uid}`);
            ref2
              .set({
                coins: 0
              })
              .catch(function(error) {
                console.log("Error creating COINS");
              });

            //if everything went right proceeds to send the apikey to the clients cookies
            let uid = "some-uid";

            admin
              .auth()
              .createCustomToken(userRecord.uid)
              .then(function(customToken) {
                // Send token back to client
                // console.log(customToken);
                socket.emit("succeful-signIn", customToken);
              })
              .catch(function(error) {
                console.log("Error creating custom token:", error);
              });
          })
          .catch(function(error) {
            //if an error occurs sends the error message to the client
            socket.emit("errors", error.errorInfo.message);
          });
      }
    });
  });

  socket.emit("loadBets", betsBlack,betsRed,betsYellow);

  socket.on("betX2", function(sessionCookie, amount) {
    if(!acceptBets){
      console.log("Apuesta denegada");
    }else{
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(decodedClaims => {

        var upvotesRef = db.ref(`coins/${decodedClaims.uid}/coins`);
        upvotesRef.transaction(function (current_value) {
          
              if(current_value!=null){
                if(current_value>=amount)
                {
                  console.log(current_value);
                  socket.emit('updateCoins',current_value-amount);
                      table.addBlackBet(amount,decodedClaims.uid);
                      betsBlack.push({amount:amount,username:decodedClaims.name});
                      table.printBlack();
                      io.emit('newBet2x',decodedClaims.name,amount);
                  return current_value-amount;
                } else{
                  //ERROR USUARIO NO TIENE SUFICIENTES COINS
                }
               
              }else{
                console.log('else');
                return current_value;
              }
          });
        });
  
      }    
     
  });
  socket.on("betX3", function(sessionCookie, amount) {
    if(!acceptBets){
      console.log("Apuesta denegada");
    }else{
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(decodedClaims => {

        var upvotesRef = db.ref(`coins/${decodedClaims.uid}/coins`);
        upvotesRef.transaction(function (current_value) {
          
              if(current_value!=null){
                if(current_value>=amount){
                  console.log(current_value);
                  socket.emit('updateCoins',current_value-amount)
                      table.addRedBet(amount,decodedClaims.uid);
                      betsRed.push({amount:amount,username:decodedClaims.name});
                      table.printBlack();
                      io.emit('newBet3x',decodedClaims.name,amount);
                  return current_value-amount;
                }else{
                   //ERROR USUARIO NO TIENE SUFICIENTES COINS
                }
               
              }else{
                console.log('else');
                return current_value;
              }
          },function(error){
            console.log('ERrorde de transaction : '+error);
          });
        });
      }
  });

  socket.on("betX10", function(sessionCookie, amount) {
    if(!acceptBets){
      console.log("Apuesta denegada");
    }else{
    admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(decodedClaims => {

      var upvotesRef = db.ref(`coins/${decodedClaims.uid}/coins`);
      upvotesRef.transaction(function (current_value) {
        
            if(current_value!=null){
              if(current_value>=amount){
                console.log(current_value);
                socket.emit('updateCoins',current_value-amount)
                    table.addYellowBet(amount,decodedClaims.uid);
                    betsYellow.push({amount:amount,username:decodedClaims.name});
                    table.printBlack();
                    io.emit('newBet10x',decodedClaims.name,amount);
                return current_value-amount;
              }else{
                //ERROR USUARIO NO TIENE SUFICIENTES COINS
              }
             
            }else{
              console.log('else');
              return current_value;
            }
        },function(error){
          console.log('ERrorde de transaction : '+error);
        });
      });
    }
  });
});

function startTimer(duration) {
  var timer = duration,
    minutes,
    seconds;

  var ran = provablyFair();
  acceptBets=true;
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
      selectWinner(ran);
      
    }
    if(timer< 3){
      acceptBets=false;
    }
  }, 1000);
}

var blackIndexs=[3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53];
var redIndexs=[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54];
var yellowIndexs=[1];

function selectWinner(ran) {
  
  io.emit("rotate", ran);
  if(blackIndexs.find(function(element){
      return element==ran;
  })){
    table.payBets('black');
  }else if(redIndexs.find(function(element){
    return element==ran;
  })){
    table.payBets('red');
  }else if(ran===1){
    table.payBets('yellow');
  }

  
  resetLoadBets();
  startTimer(30);
}

function provablyFair(){

  var ran = Math.floor(Math.random() * 54) + 1;
  console.log("RANDOM NUMBER: " + ran);

  salt = crypto.randomBytes(128).toString('base64');

  console.log('SALT: '+salt+ran)
  hash = sha256.create();
  hash.update(salt+ran);
  hash.hex();
  
  console.log('HASH: '+ hash);
  io.emit('hash',hash.hex());
  return ran;
  
}

function storeEmail(sender, reciever, key){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'anferneecas@gmail.com',
           pass: 'anfer2325'
       }
   });

   const mailOptions = {
    from: 'anferneecas@gmail.com', // sender address
    to: 'anferneecas@gmail.com', // list of receivers
    subject: 'Subject of your email', // Subject line
    html: '<p>Your html here</p>'// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
} 

