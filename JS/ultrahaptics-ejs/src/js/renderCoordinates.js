const ObjectsToCsv = require('objects-to-csv')
const { exec } = require("child_process");

function renderCoordinates (coordinates) {
    console.log(coordinates)
    let scalFact = getScalingFactor(coordinates)
    let scaledCoordinates = coordinates.map(coordinate=> coordinate.map(xy=> (xy/scalFact)- 0.02))
    const csv = new ObjectsToCsv(scaledCoordinates);
    //csv.toDisk("list.csv")
    csv.toDisk("../../csharp/UltrahapticsShapes/bin/x64/Debug/list.csv")
    try {
        exec("cd ../../csharp/UltrahapticsShapes/bin/x64/Debug/ & UltrahapticsShapes.exe SVG",
         function(err, data) {
                console.log(err)
                console.log(data)
            })

    } catch (e) {
        console.log(e)
    }
    return "Success";
}

function getScalingFactor(coordinates) {
    return Math.max(Math.max.apply(Math, 
        coordinates.map(v => v[0])), 
        Math.max.apply(Math, coordinates.map(v => v[1])))/0.04
}

module.exports = renderCoordinates