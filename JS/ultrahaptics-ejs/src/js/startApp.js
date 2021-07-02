import pathologize from './pathologize';
import pathsToCoords from './pathsToCoords';
import axios from 'axios';
import leap from './leap';
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
        let file = this.files[0];
        if (file.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = function() {
                renderSVGInHTML(pathologize(reader.result));
            };
            reader.readAsText(file);
          }
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

    var handleRenderSVGButtonCLicked = function() {
        handleRenderButtonCLicked(window.coordinates)
    }

    var handleStopClicked = function() {
        window.ocs_websocket.send_message({"type":"stop"});
    }

    var handleRenderButtonCLicked = function(coordinates) {
        let render_type = $('#render-type option:selected').val()
        if (render_type == 'select') {
            alert("Please select type of rendering!")
        } else {
            axios({
                method: 'post',
                url: '/render',
                data: {
                  coordinates: coordinates,
                }
              }).then(function (response) {
                  console.log(response)
                  if (response.data == 'Success') {
                    let render_type = $('#render-type option:selected').val()
                    window.ocs_websocket.send_message({'type': render_type})
                  }
                  
              });
        }

        
    }
    var handleTabChanged = function(event) {
        
        if (this.innerText =="File") {
            $("#file-form-tab").show();
            $("#canvas-tab").hide();
            $("#leap-live").hide();
            handleStopClicked();
            // $("#file-form-tab").hide()
        } else if (this.innerText =="Canvas") {
            $("#file-form-tab").hide();
            $("#canvas-tab").show();
            $("#leap-live").hide();
            handleStopClicked();
            // $("#file-form-tab").hide()
        } else if (this.innerText =="Leap live") {
            $("#file-form-tab").hide();
            $("#canvas-tab").hide();
            $("#leap-live").show();
            handleStopClicked();
            // $("#file-form-tab").hide()
        }


    }
    canvas_script();
    leap();
    
    document.querySelector('#file_upload').addEventListener("change", handleFileUpload)
    document.getElementById('render-button-svg').addEventListener('click', handleRenderSVGButtonCLicked)
    document.getElementById('render-button-canvas').addEventListener('click', handleRenderCanvasButtonCLicked)
    document.getElementById('stop').addEventListener('click', handleStopClicked);
    document.querySelectorAll('#navigationTab').forEach(item=> {
        item.addEventListener("click", handleTabChanged);
    })
    
}