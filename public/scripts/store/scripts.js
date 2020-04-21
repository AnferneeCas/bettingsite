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

var buttonsCoins= document.querySelectorAll('.button-coins');
buttonsCoins.forEach(function(bt){
    
    bt.addEventListener('click',function(e){
        e.preventDefault();
        var id =bt.getAttribute('data-value');
        var session = getCookie('session');
        swal({
            title: "Are you sure you want to buy this game with coins?",
            text: "After purchase, the game key will be send to your email",
            icon: "info",
            closeOnClickOutside: false,
            buttons: {cancel:'Cancel',buy:{text:'Buy',value:'buy',closeModal: false,confirmButtonColor: "#fffffff"}},
          }).then(function(value){
                switch(value){
                    case 'buy':
                    socket.emit('purchase',id,session);
                    socket.on('purchase-succeful',function(text){
                        swal({
                            title: text,
                            text: "Make sure too check your email, if you dont recieve any email with the game key please contact support",
                            icon: "success",
                            button: "Aww yiss!",
                            closeOnClickOutside: false
                          });
                    })

                    socket.on('purchase-error',function(error){
                        swal({
                            title: error,
                            text: "Make sure too check your email, if you dont recieve any email with the game key please contact support",
                            icon: "error",
                            button: "Close",
                            closeOnClickOutside: false
                          });
                    })
                    
                      break;
                }
          })
    })
})



function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }
