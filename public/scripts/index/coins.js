import { CountUp } from '../countUp.min.js';



let demo = new CountUp('counter', 0);
if (!demo.error) {
  demo.start();
} else {
  console.error(demo.error);
}

function updateCoins(number){
    demo.update(number);
}


socket.on('updateCoins',function(coins){
    updateCoins(coins);
});

if(getCookie('session')!=null){
    socket.emit('getCoins',getCookie('session'));
}
