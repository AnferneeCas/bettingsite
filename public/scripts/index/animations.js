


let theWheel = new Winwheel({
    'drawMode'     : 'image',    // drawMode must be set to image.
    'numSegments'  : 54, 
    'pointerAngle' : 180,
    'pointerGuide' :        // Turn pointer guide on.
        {
            'display'     : true,
            'strokeStyle' : 'red',
            'lineWidth'   : 3
        },         // The number of segments must be specified.
    'imageOverlay' : false,       // Set imageOverlay to true to display the overlay.
    'lineWidth'    : 2,          // Overlay uses wheel line width and stroke style so can set these
    'strokeStyle'  : 'red' ,
    'animation' :
    {
        'type'          : 'spinToStop',
        'duration'      : 11,
        'spins'         : 3,
        'callbackAfter' : 'drawTriangle()',
        'callbackFinished' : 'timer()'
    }
});


// Create new image object in memory.
let loadedImg = new Image();
 
// Create callback to execute once the image has finished loading.
loadedImg.onload = function()
{
    theWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
    theWheel.draw();                    // Also call draw function to render the wheel.
}
 
// Set the image source, once complete this will trigger the onLoad callback (above).
loadedImg.src = 'http://localhost:3000/scripts/wheel.png';
function spin(number){
    let segmentNumber = number ;   // The segment number should be in response.
 
            if (segmentNumber) {
                // Get random angle inside specified segment of the wheel.
                let stopAt = theWheel.getRandomForSegment(segmentNumber);
 
                // Important thing is to set the stopAngle of the animation before stating the spin.
                theWheel.animation.stopAngle = stopAt;
 
                // Start the spin animation here.
                theWheel.startAnimation();
            }

             // Usual pointer drawing code.
    drawTriangle();
}

function timer(){
    document.querySelector('.timer').setAttribute('style','visibility: visible');
}
 
    function drawTriangle()
    {
        // Get the canvas context the wheel uses.
        let ctx = theWheel.ctx;
 
        ctx.strokeStyle = 'navy';  // Set line colour.
        ctx.fillStyle   = 'aqua';  // Set fill colour.
        ctx.lineWidth   = 2;
        ctx.beginPath();           // Begin path.
        ctx.moveTo(170, 5);        // Move to initial position.
        ctx.lineTo(230, 5);        // Draw lines to make the shape.
        ctx.lineTo(200, 40);
        ctx.lineTo(171, 5);
        ctx.stroke();              // Complete the path by stroking (draw lines).
        ctx.fill();                // Then fill.

       
   
    }


    var buttonX3 = document.querySelector(".button-3x").addEventListener('click',function(e){
        e.preventDefault();
        spin(document.querySelector('#amount').value);
        theWheel.rotationAngle=0;
        //resetWheel();
    });

    var buttonX3 = document.querySelector(".button-10x").addEventListener('click',function(e){
        e.preventDefault();
       // theWheel.stopAnimation(false);
      
       // theWheel.draw();
       // drawTriangle();
       // wheelSpinning=false;    
    });



socket.on('tick',function(time){
    console.log("hola");
    console.log(time);
    document.querySelector('.timer').innerHTML=time;
})

socket.on('rotate',function(number){
    spin(number);
    theWheel.rotationAngle=0;
    document.querySelector('.timer').setAttribute('style','visibility: hidden');
   
})