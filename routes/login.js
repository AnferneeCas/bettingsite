var express = require("express");
var router = express.Router();
var {admin} = require('./firebaseconfig.js');


router.get("/login", function(req, res) {
    console.log("SESSION COOKIES LOGIN");
    console.log(req.cookies.session);
  
    const sessionCookie = req.cookies.session || '';
      if(sessionCookie !=''||sessionCookie!=null){
        admin.auth().verifySessionCookie(
          sessionCookie, false /** checkRevoked */)
          .then((decodedClaims) => {
            res.redirect('/');
          })
          .catch(error => {
            // Session cookie is unavailable or invalid. Force user to login.
            console.log(error);
            res.render('login.html');
  
          });
      }else{
        res.render('login.html');
      }
     
   
  });

  router.post("/login/:idToken", function(req, res) {
    // console.log(req.params.idToken.toString());
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    admin
      .auth()
      .createSessionCookie(req.params.idToken.toString(), { expiresIn })
      .then(
        sessionCookie => {
          // Set cookie policy for session cookie.
          const options = { maxAge: expiresIn, httpOnly: true, secure: true };
          res.cookie("session", sessionCookie);
          console.log("SESION COOKRIR" + sessionCookie, options);
          res.cookie("test", "test");
          res.redirect("/");
        },
        error => {
          console.log("Error creando cookie");
          res.redirect("/login");
        }
      );
  });

  module.exports= router;