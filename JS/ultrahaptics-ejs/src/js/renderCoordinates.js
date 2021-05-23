const ObjectsToCsv = require('objects-to-csv')
const { exec } = require("child_process");

function renderCoordinates (coordinates) {
    const csv = new ObjectsToCsv(coordinates);
    try {
        csv.toDisk(
            "../../csharp/UltrahapticsShapes/bin/x64/Debug/list.csv")
    } catch (e) {
        console.log(e)
    }
    exec("../../csharp/UltrahapticsShapes/bin/x64/Debug/UltrahapticsShapes.exe")

    return "Success";
}

module.exports = renderCoordinates
