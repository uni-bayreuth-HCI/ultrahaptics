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

    var handleRenderButtonCLicked = function(coordinates) {
        
        axios({
            method: 'post',
            url: '/render',
            data: {
              coordinates: coordinates,
            }
          }).then(function (response) {
              
          });
    }
    canvas_script();
    leap();
    
    document.querySelector('#file_upload').addEventListener("change", handleFileUpload)
    document.getElementById('render-button-svg').addEventListener('click', handleRenderSVGButtonCLicked)
    document.getElementById('render-button-canvas').addEventListener('click', handleRenderCanvasButtonCLicked)
}