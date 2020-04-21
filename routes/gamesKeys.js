var express = require("express");
var router = express.Router();
var {admin} = require('./firebaseconfig.js');
var db = admin.database();
function newGame(name,price,key,region,platform) {

    var ref = db.ref().child('games');

    ref.push().set({
        name:name,
        price:price,
        key:key,
        region:region,
        platform:platform
    })
           
          
}

//newGame('battlefkiedl',10.25,'fwer23vgrvsdsdf','Global','Steam');
module.exports= router;