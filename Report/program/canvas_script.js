

export default function canvas_script () {
    //canvas functions
  var canvas = document.getElementById('shape-canvas');
  var ctx = canvas.getContext('2d');
  reset_canvas();
  // CODE FOR MOUSE AND DRAWING:

  var pos = { x: 0, y: 0 }; // last known mouse position
  window.canvas_coordinates = []
  // mouse event liseners:
  document.addEventListener('mousemove', draw);
  document.addEventListener('mousedown', setPosition);
  document.addEventListener('mouseenter', setPosition);
  $("#clear_button").click(reset_canvas);

  // new position from mouse event
  function setPosition(e) {
    var rect = canvas.getBoundingClientRect();
    pos.x = e.clientX - rect.left;
    pos.y = e.clientY - rect.top;
  }

  // clear the drawing
  function reset_canvas() {
      ctx.fillStyle = "#FFFFFF";
      ctx.clearRect(0, 0, ctx.width, ctx.height);
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.beginPath();
      window.canvas_coordinates = []
  }

  // allow user to draw on the canvas by connecting subsequent mouse points with a line
  function draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';

    // TODO: implement the drawing functionality
    ctx.moveTo(pos.x, pos.y);
    setPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    window.canvas_coordinates.push([pos.x,pos.y])
  }

  document.getElementById('clear-button-canvas').addEventListener('click', reset_canvas);
  
}