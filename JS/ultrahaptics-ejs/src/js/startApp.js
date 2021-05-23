import pathologize from './pathologize';
import pathsToCoords from './pathsToCoords';
import axios from 'axios';
var data= {
    scale:1,
    numPoints:2000,
    translateX:1,
    translateY:1
}

export default function startApp () {
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

    var handleRenderButtonCLicked = function() {
        console.log(window.coordinates)
        axios({
            method: 'post',
            url: '/render',
            data: {
              coordinates: window.coordinates,
            }
          }).then(function (response) {
            
          });
          
    }

    document.querySelector('#file_upload').addEventListener("change", handleFileUpload)
    document.getElementById('render-button').addEventListener('click', handleRenderButtonCLicked)
}