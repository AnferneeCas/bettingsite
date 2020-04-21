const { admin } = require("./firebaseconfig.js");

var db = admin.database();
class table {
  constructor() {
    this.black = [];
    this.red = [];
    this.yellow = [];
  }
  addBlackBet(amount, uid) {
    this.black.push({ amount: amount, uid: uid });
  }
  addRedBet(amount, uid) {
    this.red.push({ amount: amount, uid: uid });
  }
  addYellowBet(amount, uid) {
    this.yellow.push({ amount: amount, uid: uid });
  }
  printBlack() {
    console.log(JSON.stringify(this));
  }
  payBets(color) {

    if(color==='black'){

    this.black.forEach(element => {
      var upvotesRef = db.ref(`coins/${element.uid}/coins`);
      upvotesRef.transaction(function (current_value) {
        return (current_value  + (element.amount*2));
      });

        //console.log('DATA SNAPSHOT:       '+snapshot.val().coins);
      
    });
    
     }
     else if(color==='red'){
        this.red.forEach(element => {
          var upvotesRef = db.ref(`coins/${element.uid}/coins`);
          upvotesRef.transaction(function (current_value) {
            return (current_value  + (element.amount*3));
          });
          });
      
     }else if(color==='yellow'){
        this.yellow.forEach(element => {
          var upvotesRef = db.ref(`coins/${element.uid}/coins`);
       upvotesRef.transaction(function (current_value) {
        return (current_value  + (element.amount*10));
      });
          });
          
     }

     
     this.restart();
     //end of method
    }
  restart(){
      this.black=[];
      this.red=[];
      this.yellow=[];
  }
}

module.exports = table;
