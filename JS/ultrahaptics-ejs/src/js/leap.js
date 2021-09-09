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

  var controller = new Leap.Controller({enableGestures: true});
  var ctrl = new Leap.Controller({enableGestures: true});
  var canvas = document.getElementById('leaplivecanvas');
  var ctx = canvas.getContext('2d');   
  
  reset_canvas();

  window.leap_live_canvas_coordinates = []

  var centerX = 0;
  var centerY = 0;
  
  sizing(); 

  function reset_canvas(){
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    controller.connect();
  }

  $(window).resize(function() {
    sizing();
    draw(centerX, centerY);
  });

  function sizing() {
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
  }

  // controller.on('frame', function(frame) {
  //   if (frame.fingers[0]) {
  //     var x = frame.fingers[1].tipPosition[0];
  //     var y = frame.fingers[1].tipPosition[1];
  //     window.leap_live_canvas_coordinates.push([x,y])
  //     draw(x + centerX, canvas.height - y);
  //   }
  // });

  controller.on('gesture', function (gesture) {
    if (gesture.type == 'keyTap') {
      fadeOut('Start Drawing!');
      controller.disconnect();
      ctrl.connect();
      ctrl.on('frame', function(frame) {
        if (frame.fingers[0]) {
          var x = frame.fingers[1].tipPosition[0];
          var y = frame.fingers[1].tipPosition[1];
          window.leap_live_canvas_coordinates.push([x,y])
          draw(x + centerX, canvas.height - y);
          
        }
      });
      
      ctrl.on('gesture', function (gesture) {
        if (gesture.type == 'keyTap') {
          alert("Drawing stopped!");
          ctrl.disconnect();
        }
      });
    }
  });

  
  function draw(x, y, radius) {
    if (typeof radius === 'undefined') {
      radius = 4;
    } 
    else {
      radius = radius < 4 ? 4 : radius;
    }
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 5;
    //ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.fillRect(x, y, 4, 4);
    //ctx.fill();
  }  

  controller.connect();  

  function fadeOut(text) {
    var alpha = 1.0,   // full opacity
        interval = setInterval(function () {
            canvas.width = canvas.width; // Clears the canvas
            ctx.fillStyle = "#000000" + alpha + ")";
            ctx.font = "italic 20pt Arial";
            ctx.fillText(text, 50, 50);
            alpha = alpha - 0.05; // decrease opacity (fade out)
            if (alpha < 0) {
                canvas.width = canvas.width;
                clearInterval(interval);
            }
        }, 50); 
  }

  document.getElementById('clear-leap-live-canvas').addEventListener('click', reset_canvas);

}