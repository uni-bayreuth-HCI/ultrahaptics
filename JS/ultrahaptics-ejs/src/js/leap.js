import cs_websocket from "./cs_websocket";

export default function leap() {

  var controller = new Leap.Controller({enableGestures: true, frameEventName: 'deviceFrame'});
  var ctrl = new Leap.Controller({enableGestures: true, frameEventName: 'deviceFrame'});
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
    window.leap_live_canvas_coordinates = []
    controller.connect();
  }

  $(window).resize(function() {
    sizing();
  });

  function sizing() {
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
  }

  controller.on('gesture', function (gesture) {
    if (gesture.type == 'keyTap') {
      toastr["info"]('Start Drawing', "Leap");

      window.ocs_websocket ? window.ocs_websocket.send_message({type:'leap-live-start',X:0, Y:0}) :null;

      
      controller.disconnect();
      ctrl.connect();
      ctrl.on('frame', function(frame) {
        if (frame.fingers[0]) {
          var x = frame.fingers[1].tipPosition[0];
          var y = frame.fingers[1].tipPosition[1];

          var scalingfactor = 500/0.16
          // console.log(x + centerX, );
          draw(x + centerX, canvas.height - y);          
          window.ocs_websocket ? window.ocs_websocket.send_message({type:'leap-live-update',X:(x+centerX)/scalingfactor -0.08, Y: (0 -(canvas.height - y)/scalingfactor)+0.08})  :null;
        }
      });
      
      ctrl.on('gesture', function (gesture) {
        if (gesture.type == 'keyTap') {
          toastr["info"]('Drawing stopped.', "Leap");
          window.ocs_websocket ? window.ocs_websocket.send_message({"type":"stop"}) : null;
          window.leap_live_canvas_coordinates = [];
          ctrl.disconnect();
        }
      });
    }
  });

  
  function draw(x, y, radius) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (typeof radius === 'undefined') {
      radius = 4;
    } 
    else {
      radius = radius < 4 ? 4 : radius;
    }
    
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();

    // cs_websocket.send({type:'leap live',X:x, Y:y})

    // console.log(x + " " + y + "\n")
    
  }  

  toastr["info"]('KeyTap gesture to start drawing!', "Leap")

  controller.on('deviceAttached', function (gesture) {
    toastr["info"]('Leap Motion device is ready!', "Leap")
  });

  controller.connect();  

  document.getElementById('start-leap-button').addEventListener('click', reset_canvas);

}