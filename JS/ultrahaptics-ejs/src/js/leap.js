export default function leap() {
    // var frameData = document.getElementById('frameData');
    // var handData = document.getElementById('handData');
    // var fingerData = document.getElementById('fingerData');
    // var palmDisplay = document.getElementById('palm');
    // var fingersDisplay = document.getElementsByClassName('finger');

    // Leap.loop(function (frame) {

    //     // Get and show frame data
    //     frameData.innerHTML = "Frame ID: " + frame.id + "<br>"
    //         + "No of Hands: " + frame.hands.length + "<br>"
    //         + "No of Fingers: " + frame.fingers.length + "";

    //     // Get and show hand data
    //     handData.innerHTML = "";
    //     for (var i = 0; i < frame.hands.length; i++) {
    //         var hand = frame.hands[i];
    //         handData.innerHTML += "Hand ID: " + hand.id + "<br>"
    //             + "Hand Type: " + hand.type + "<br>"
    //             + "Palm Position: " + hand.palmPosition + "<br>"
    //             + "Grab Strength: " + hand.grabStrength + "<br>"
    //             + "Pinch Strength: " + hand.pinchStrength + "<br><br>";

    //         var normalizedPalmPosition = frame.interactionBox.normalizePoint(hand.palmPosition, true);

    //         var palmX = window.innerWidth * normalizedPalmPosition[0] - palmDisplay.offsetWidth / 2;
    //         palmDisplay.style.left = palmX + "px";

    //         var palmY = window.innerHeight * (1 - normalizedPalmPosition[1]) - palmDisplay.offsetHeight / 2;
    //         palmDisplay.style.top = palmY + "px";


    //     }
    //     // Get and show finger data
    //     fingerData.innerHTML = "";
    //     for (var k = 0; k < frame.fingers.length; k++) {
    //         var finger = frame.fingers[k];
    //         fingerData.innerHTML += "Finger ID: " + finger.id + "<br>"
    //             + "Belong to Hand ID: " + finger.handId + "<br>"
    //             + "Finger Tip Position: " + finger.tipPosition + "<br>"
    //             + "Finger Type: " + finger.type + "<br>" + "<br>";
    //     }
    // })

var canvas = document.getElementById('leaplivecanvas');
var ctx = canvas.getContext('2d');
   
var info = document.getElementById('data');
var radius = 10;

// set the canvas to cover the screen
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

// move the context co-ordinates to the bottom middle of the screen
ctx.translate(canvas.width/2, canvas.height);

ctx.fillStyle = "rgba(0,0,0,0.9)";
ctx.strokeStyle = "rgba(255,0,0,0.9)";
ctx.lineWidth = 5;

function draw(frame) {
// set up data array and other variables
var data = [],
    pos, i, len;

// cover the canvas with a 10% opaque layer for fade out effect.
ctx.fillStyle = "rgba(255,255,255,0.1)";
ctx.fillRect(-canvas.width/2,-canvas.height,canvas.width,canvas.height);

// set the fill to black for the points
ctx.fillStyle = "rgba(0,0,0,0.9)";

// loop over the frame's pointables
for (i=0, len=frame.pointables.length; i<len; i++) {
  // get the pointable and its position
  pos = frame.pointables[i].tipPosition;

  // add the position data to our data array
  data.push(pos);

  // draw the circle where the pointable is
  ctx.beginPath();
  ctx.arc(pos.x-radius/2 ,-(pos.y-radius/2),radius,0,2*Math.PI);
  ctx.fill();
  ctx.stroke();
}

// print out our position points
info.innerHTML = data.join(', ');
};

// run the animation loop with the draw command
Leap.loop(draw);


}