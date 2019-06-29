var buttonX2 = document.querySelector(".button-2x");
var buttonX3 = document.querySelector(".button-3x");
var buttonX10 = document.querySelector(".button-10x");


//GETS BETS RECORD
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


//EVENTLISTENER FOR BETTINGS BUTTONS


buttonX2.addEventListener('click',function(e){
    e.preventDefault();
    var amount= document.querySelector('#amount').value;
    if(amount>0){
        
        socket.emit('betX2',name,amount);
    }
    
})



buttonX3.addEventListener('click',function(e){
    e.preventDefault();
    var amount= document.querySelector('#amount').value;
    if(amount>0){
        
        socket.emit('betX3',name,amount);
    }
    
})


buttonX10.addEventListener('click',function(e){
    e.preventDefault();
    var amount= document.querySelector('#amount').value;
    if(amount>0){
       
        socket.emit('betX10',name,amount);
    }
})


//  BETS LISTENER

socket.on('newBet2x',function(user,amount){
    
    document.querySelector("#List2X").innerHTML+=`<button type="button" class="list-group-item list-group-item-action"><div><span>${user}</span> <div class="amount-bet"><span>${amount}</span> <img src="./coin.png" class="coin"></div> </div> </button>`
})

socket.on('newBet3x',function(user,amount){
    
    document.querySelector("#List3X").innerHTML+=`<button type="button" class="list-group-item list-group-item-action"><div><span>${user}</span> <div class="amount-bet"><span>${amount}</span> <img src="./coin.png" class="coin"></div> </div> </button>`
})

socket.on('newBet10x',function(user,amount){
    
    document.querySelector("#List10X").innerHTML+=`<button type="button" class="list-group-item list-group-item-action"><div><span>${user}</span> <div class="amount-bet"><span>${amount}</span> <img src="./coin.png" class="coin"></div> </div> </button>`
})