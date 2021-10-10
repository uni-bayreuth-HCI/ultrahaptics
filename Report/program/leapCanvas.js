export default function leap_canvas() {

  var controller = new Leap.Controller({enableGestures: true, frameEventName: 'deviceFrame'});
  var ctrl = new Leap.Controller({enableGestures: true, frameEventName: 'deviceFrame'});
  var canvas = document.getElementById('leapcanvas');
  var context = canvas.getContext('2d');

  reset_canvas();
  
  window.leap_canvas_coordinates = []

  var centerX = 0;
  var centerY = 0;
  
  sizing();  

  function reset_canvas(){
    context.fillStyle = "#FFFFFF";
    context.clearRect(0, 0, context.width, context.height);
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    window.leap_canvas_coordinates = []
    controller.connect();
  }   
  
  controller.on('gesture', function (gesture) {
    if (gesture.type == 'keyTap') {
      fadeOut('Start Drawing!');
      controller.disconnect();
      ctrl.connect();
      ctrl.on('frame', function(frame) {
        if (frame.fingers[0]) {
          var x = frame.fingers[1].tipPosition[0];
          var y = frame.fingers[1].tipPosition[1];
          draw(x + centerX, canvas.height - y);
        }
      });
      
      ctrl.on('gesture', function (gesture) {
        if (gesture.type == 'keyTap') {
          toastr["info"]('Drawing stopped.', "Leap")
          ctrl.disconnect();
        }
      });
    }
  });  

  $(window).resize(function() {
    sizing();
    draw(centerX, centerY);
  });

  function sizing() {
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
  }

  function draw(x, y, radius) {
    if (typeof radius === 'undefined') {
        radius = 4;
    } 
    else {
        radius = radius < 4 ? 4 : radius;
    }

    context.strokeStyle = '#000000';
    context.fillStyle = '#000000';
    context.lineWidth = 5;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
    window.leap_canvas_coordinates.push([x,y])
  }

  function fadeOut(text) {
    var alpha = 1.0,   // full opacity
        interval = setInterval(function () {
            canvas.width = canvas.width; // Clears the canvas
            context.fillStyle = "#000000" + alpha + ")";
            context.font = "italic 20pt Arial";
            context.fillText(text, 50, 50);
            alpha = alpha - 0.05; // decrease opacity (fade out)
            if (alpha < 0) {
                canvas.width = canvas.width;
                clearInterval(interval);
            }
        }, 50); 
  } 

  toastr["info"]('KeyTap gesture to start drawing!', "Leap")

  controller.connect();
  
  document.getElementById('clear-button-leap-canvas').addEventListener('click', reset_canvas);

}