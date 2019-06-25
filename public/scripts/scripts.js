
const socket = io("localhost:3000");
var name = "anfer";
var buttonX2 = document.querySelector(".button-2x");
buttonX2.addEventListener('click',function(e){
    e.preventDefault();
    var amount= document.querySelector('#amount').value;
    if(amount>0){
        console.log("clicked");
        socket.emit('betX2',name,amount);
    }
    
})

var buttonX3 = document.querySelector(".button-3x");
buttonX3.addEventListener('click',function(e){
    e.preventDefault();
    var amount= document.querySelector('#amount').value;
    if(amount>0){
        console.log("clicked");
        socket.emit('betX3',name,amount);
    }
})

var buttonX10 = document.querySelector(".button-10x");
buttonX10.addEventListener('click',function(e){
    e.preventDefault();
    var amount= document.querySelector('#amount').value;
    if(amount>0){
        console.log("clicked");
        socket.emit('betX10',name,amount);
    }
})

socket.on('loadBets',function(bets){
    bets[0].better2x.forEach(element => {
        document.querySelector("#List2X").innerHTML+=`<button type="button" class="list-group-item list-group-item-action"><div><span>${element.name}</span> <div class="amount-bet"><span>${element.amount}</span> <img src="./coin.png" class="coin"></div> </div> </button>`
    });
    bets[1].better3x.forEach(element => {
        document.querySelector("#List3X").innerHTML+=`<button type="button" class="list-group-item list-group-item-action"><div><span>${element.name}</span> <div class="amount-bet"><span>${element.amount}</span> <img src="./coin.png" class="coin"></div> </div> </button>`
    });
    bets[2].better10x.forEach(element => {
        document.querySelector("#List10X").innerHTML+=`<button type="button" class="list-group-item list-group-item-action"><div><span>${element.name}</span> <div class="amount-bet"><span>${element.amount}</span> <img src="./coin.png" class="coin"></div> </div> </button>`
    });
})

socket.on('newBet2x',function(user,amount){
    console.log('new bet');
    document.querySelector("#List2X").innerHTML+=`<button type="button" class="list-group-item list-group-item-action"><div><span>${user}</span> <div class="amount-bet"><span>${amount}</span> <img src="./coin.png" class="coin"></div> </div> </button>`
})

socket.on('newBet3x',function(user,amount){
    console.log('new bet');
    document.querySelector("#List3X").innerHTML+=`<button type="button" class="list-group-item list-group-item-action"><div><span>${user}</span> <div class="amount-bet"><span>${amount}</span> <img src="./coin.png" class="coin"></div> </div> </button>`
})

socket.on('newBet10x',function(user,amount){
    console.log('new bet');
    document.querySelector("#List10X").innerHTML+=`<button type="button" class="list-group-item list-group-item-action"><div><span>${user}</span> <div class="amount-bet"><span>${amount}</span> <img src="./coin.png" class="coin"></div> </div> </button>`
})

socket.on('tick',function(time){
    console.log("hola");
    console.log(time);
    document.querySelector('.timer').innerHTML=time;
})

socket.on('rotate',function(){
    document.getElementById("wheel").setAttribute("style","transform: rotate(190.647deg);");
    setTimeout(function(){
        document.getElementById("wheel").setAttribute("style","");

    },8000)
   
})