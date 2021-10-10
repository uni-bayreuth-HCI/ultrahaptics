import pathologize from './pathologize';
import pathsToCoords from './pathsToCoords';
import axios from 'axios';
import leap from './leap';
import leap_canvas from './leapCanvas.js'
import canvas_script from './canvas_script';
import cs_websocket from './cs_websocket'

/**
 * this data is used while converting the svg to the coordinate points
 * NOTE: the scaling of the coordinates to render on ultrahaptics device 
 * for size adjustment is done in renderCoordinates.js
 * 
 * we recommend to change only number of points here.
 **/ 
var data= {
    scale:1,
    numPoints:1000, //number of points to be generated from svg to coordinates
    translateX:1,
    translateY:1
}

//as soon as the application starts this function controls the 
//html dom for all the functions.
export default function startApp () {
    
    window.ocs_websocket = cs_websocket();
    window.coordinates;


    /**As soon as the file is uploaded in the first tab the 
     * control comes here to handle the uploaded file and process it
     * a) if the file is svg, transform it to the canvas and get all the coordinates
     * b) if the file is csv just extract the coordinates from it 
     * 
     * The  csv coordinates should be scaled according to ultrahaptics, 
     * this function do not process the coordinates from csv
     **/
    var handleFileUpload = function (e) {
        debugger;
        window.coordinates = [];
        let file = this.files[0];
        const reader = new FileReader();
        
        if (file.type == 'application/vnd.ms-excel') {
            reader.onload = function() {
                var allTextLines = reader.result.split(/\r\n|\n/);
                
                //below for loop converts the csv file from string form to array of coordinates
                for (var i=0; i<allTextLines.length; i++) {
                    var data = allTextLines[i].split(',');
                    if (allTextLines[i] == '') continue; //empty lines in csv file will nullify here
                        var tarr = [];
                        for (var j=0; j<data.length; j++) {
                            tarr.push(data[j]);
                        }
                        window.coordinates.push(tarr);
                }
                
            };
        }
        if (file.type === 'image/svg+xml') {
            reader.onload = function() {
                //pathologize: extracts the path elements from the svg 
                let path = pathologize(reader.result)
                renderSVGInHTML(path);
            };
        }

        reader.readAsText(file);
    }

    //renders svg in html for preview and visuals
    var renderSVGInHTML = function (pathsOnly) {
        // document.body.appendChild(pathsOnly)
        document.getElementById('svg-holder').innerHTML = pathsOnly
        var paths = document.getElementById('svg-holder').getElementsByTagName('path');

        //converts the path elements to coordinates
        window.coordinates=pathsToCoords(paths, data.scale, data.numPoints, data.translateX, data.translateY)
    }


    /**
     * as soon as you click the render button on 
     * any tab the coordinates are sent to the backend
     *  via axios request from this function.
     * 
     * This function, sends the data to nodejs server and the node js function
     *  writes the coordinates  data in a file.
     * In the callback this function informs the ultrahaptics via 
     * websocket to render the updated coordinates from the file.
     *  
     * @param {*} coordinates array of arrays i.e x,y coordinates
     */
    var handleRenderButtonCLicked = function(coordinates) {
        debugger;
        let render_type = $('#render-type option:selected').val()
        if (render_type == 'select') {
            
            toastr["error"]("Please select type of rendering, from top left drop down.",
             "Ultrahaptics")

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

    /**
     * Whenever a new tab in UI is clicked the control comes here
     * @param {*} event 
     */
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

            //canvas was showing random points after opening. this will clean the canvas
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
    var handleRenderCanvasButtonCLicked = function() {
        handleRenderButtonCLicked(window.canvas_coordinates)
    }

    var handleRenderLeapCanvasButtonCLicked = function() {
        handleRenderButtonCLicked(window.leap_canvas_coordinates)
    }

    var handleRenderSVGButtonCLicked = function() {
        debugger;
        handleRenderButtonCLicked(window.coordinates)
    }

    //Stops the ultrahaptics device by communicating over websocket
    var handleStopClicked = function() {
        window.ocs_websocket ? window.ocs_websocket.send_message({"type":"stop"}) : null;
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

    

    /**
     * Settings for thetoastr library which is
     *  responsible for showing the layover warning or success messages
     */
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