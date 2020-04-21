var express = require("express");
var router = express.Router();
var {admin} = require('./firebaseconfig.js');
var db = admin.database();
function addPrice(value,amountCoins){
    var ref = db.ref(`prices/${value}`);

    ref.set({amountCoins:amountCoins});
}

//addPrice(25,28500);
module.exports= router;