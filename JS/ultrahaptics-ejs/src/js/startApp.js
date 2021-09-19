import pathologize from './pathologize';
import pathsToCoords from './pathsToCoords';
import axios from 'axios';
import leap from './leap';
import leap_canvas from './leapCanvas.js'
import canvas_script from './canvas_script';
import cs_websocket from './cs_websocket'

var data= {
    scale:1,
    numPoints:1000,
    translateX:1,
    translateY:1
}

export default function startApp () {
    window.ocs_websocket = cs_websocket();
    window.coordinates;
    var handleFileUpload = function (e) {
        window.coordinates = [];
        let file = this.files[0];
        const reader = new FileReader();
        
        if (file.type == 'application/vnd.ms-excel') {
            reader.onload = function() {
                window.csv_cords = reader.result;
                var allTextLines = csv_cords.split(/\r\n|\n/);
                
                for (var i=0; i<allTextLines.length; i++) {
                    var data = allTextLines[i].split(',');
                    if (allTextLines[i] == '') continue;
                        var tarr = [];
                        for (var j=0; j<data.length; j++) {
                            tarr.push(data[j]);
                        }
                        window.coordinates.push(tarr);
                }
                //===
            };
        }
        if (file.type === 'image/svg+xml') {
            reader.onload = function() {
                renderSVGInHTML(pathologize(reader.result));
            };
        }

        reader.readAsText(file);
    }

    var renderSVGInHTML = function (pathsOnly) {
        // document.body.appendChild(pathsOnly)
        document.getElementById('svg-holder').innerHTML = pathsOnly
        var paths = document.getElementById('svg-holder').getElementsByTagName('path');
        window.coordinates=pathsToCoords(paths, data.scale, data.numPoints, data.translateX, data.translateY)
    }

    var handleRenderCanvasButtonCLicked = function() {
        handleRenderButtonCLicked(window.canvas_coordinates)
    }

    var handleRenderLeapCanvasButtonCLicked = function() {
        handleRenderButtonCLicked(window.leap_canvas_coordinates)
    }

    var handleRenderSVGButtonCLicked = function() {
        handleRenderButtonCLicked(window.coordinates)
    }

    var handleStopClicked = function() {
        window.ocs_websocket ? window.ocs_websocket.send_message({"type":"stop"}) : null;
    }

    var handleRenderButtonCLicked = function(coordinates) {
        let render_type = $('#render-type option:selected').val()
        if (render_type == 'select') {
            
            toastr["error"]("Please select type of rendering, from top left drop down.", "Ultrahaptics")
        } else {
            let coordinates_csv = false;
            if (document.querySelector('#file_upload').files[0] && 
            document.querySelector('#file_upload').files[0].type == 'application/vnd.ms-excel')  {
                coordinates_csv = true;
            }
            axios({
                method: 'post',
                url: '/render',
                data: {
                  coordinates: coordinates,
                  coordinates_csv: coordinates_csv
                }
              }).then(function (response) {
                  console.log(response);
                  if (response.data == 'Success') {
                    let render_type = $('#render-type option:selected').val()
                    window.ocs_websocket ? window.ocs_websocket.send_message({'type': render_type}) :null;
                  }
              });
        }
    }
    var handleTabChanged = function(event) {
        
        if (this.innerText =="File") {
            $("#file-form-tab").show();
            $("#canvas-tab").hide();
            $("#leap-live-canvas-tab").hide();
            $("#leap-canvas-tab").hide();
            handleStopClicked();
        } else if (this.innerText =="Canvas") {
            $("#file-form-tab").hide();
            $("#canvas-tab").show();
            $("#leap-live-canvas-tab").hide();
            $("#leap-canvas-tab").hide();
            var canvas = document.getElementById('shape-canvas');
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = "#FFFFFF";
            ctx.clearRect(0, 0, ctx.width, ctx.height);
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();
            window.canvas_coordinates = []
            handleStopClicked();
        } else if (this.innerText =="Leap live") {
            $("#file-form-tab").hide();
            $("#canvas-tab").hide();
            $("#leap-live-canvas-tab").show();
            $("#leap-canvas-tab").hide();
            handleStopClicked();

            setTimeout(function(){ toastr["success"]('Leap Live Ready', "Leap");
            leap(); }, 2000);
        } else if (this.innerText == "Leap Canvas") {
            $("#file-form-tab").hide();
            $("#canvas-tab").hide();
            $("#leap-live-canvas-tab").hide();
            $("#leap-canvas-tab").show();            
            handleStopClicked();
            
            setTimeout(function(){ toastr["success"]('Leap Canvas Ready', "Leap");
            leap_canvas(); }, 2000);
        }
    }

    canvas_script();    
    
    document.querySelector('#file_upload').addEventListener("change", handleFileUpload)
    document.getElementById('render-button-svg').addEventListener('click', handleRenderSVGButtonCLicked)
    document.getElementById('render-button-canvas').addEventListener('click', handleRenderCanvasButtonCLicked)
    document.getElementById('render-button-leap-canvas').addEventListener('click', handleRenderLeapCanvasButtonCLicked)
    document.getElementById('stop').addEventListener('click', handleStopClicked);
    document.querySelectorAll('#navigationTab').forEach(item=> {
        item.addEventListener("click", handleTabChanged);
    })

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "500",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }

}