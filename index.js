var express = require('express');
var app= express();
var port = process.env.PORT||3000;
var socketio = require("socket.io");
var better=[{better2x:[]},{better3x:[]},{better10x:[]}];
app.use(express.static(__dirname+'/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);

app.get("/",function(req,res){
    res.render("index.html");
})

app.get("/login",function(req,res){
    
    res.render("login.html");
})
app.get("/signin",function(req,res){
    res.render("signin.html");
})



const expressServer = app.listen(port);
const io = socketio(expressServer);
startTimer(10);
io.on('connection',function(socket){
    console.log(`user Connected: ${socket.id}`);
    socket.emit('loadBets',better);

    socket.on('betX2',function(name,amount){
        io.emit('newBet2x',name,amount);
        better[0].better2x.push({name:name,amount:amount});
    })

    socket.on('betX3',function(name,amount){
        io.emit('newBet3x',name,amount);
        better[1].better3x.push({name:name,amount:amount});
    })

    socket.on('betX10',function(name,amount){
        io.emit('newBet10x',name,amount);
        better[2].better10x.push({name:name,amount:amount});
    })


})


function startTimer(duration) {
    var timer = duration, minutes, seconds;
   var interval= setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? minutes : minutes;
        seconds = seconds < 10 ?  seconds : seconds;

        var time ='Timer: '+ minutes + ":" + seconds;
        
        io.emit('tick',time);

        if (--timer < 0) {
            timer = duration;
           clearInterval(this);
           selectWinner();
        }
    }, 1000);
    
}

function selectWinner(){
    io.emit('rotate');
    setTimeout(function(){
        startTimer(10);
        console.log("empezo");
        },10000)
    
}