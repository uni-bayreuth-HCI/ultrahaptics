const ObjectsToCsv = require('objects-to-csv')
const { exec } = require("child_process");
const fs = require('fs')

const path = "../../csharp/UltrahapticsShapes/bin/x64/Debug/list.csv";


function renderCoordinates (coordinates) {
  //=======================
  // const csvw = new ObjectsToCsv(coordinates);
  // csvw.toDisk("../../csharp/UltrahapticsShapes/bin/x64/Debug/listaaaa.csv");  
  //=======================
    let scalingFact = getScalingFactor(coordinates)
    let scaledCoordinates = coordinates.map(coordinate=> coordinate.map(xy=> (xy/scalingFact)- 0.04));
    scaledCoordinates.map(cord=> cord[1] = (0-cord[1])); //mirror x
    // scaledCoordinates.map(cord=> {
    //   temp = cord[1];
    //   cord[1] = (-cord[0])
    //   cord[0] = temp;
    // })

    const csv = new ObjectsToCsv(scaledCoordinates);
    try {
        fs.unlinkSync(path)
        //file removed
    } catch(err) {
        console.error(err)
    }
    csv.toDisk(path);
    
    return "Success";
}

function getScalingFactor(coordinates) {
    return Math.max(Math.max.apply(Math, 
        coordinates.map(v => v[0])), 
        Math.max.apply(Math, coordinates.map(v => v[1])))/0.08
}

module.exports = renderCoordinates