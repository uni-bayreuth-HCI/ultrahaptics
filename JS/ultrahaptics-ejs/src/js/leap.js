

export default function leap() {
    var frameData = document.getElementById('frameData');
    var handData = document.getElementById('handData');
    var fingerData = document.getElementById('fingerData');
    var palmDisplay = document.getElementById('palm');
    var fingersDisplay = document.getElementsByClassName('finger');

    Leap.loop(function (frame) {

        // Get and show frame data
        frameData.innerHTML = "Frame ID: " + frame.id + "<br>"
            + "No of Hands: " + frame.hands.length + "<br>"
            + "No of Fingers: " + frame.fingers.length + "";

        // Get and show hand data
        handData.innerHTML = "";
        for (var i = 0; i < frame.hands.length; i++) {
            var hand = frame.hands[i];
            handData.innerHTML += "Hand ID: " + hand.id + "<br>"
                + "Hand Type: " + hand.type + "<br>"
                + "Palm Position: " + hand.palmPosition + "<br>"
                + "Grab Strength: " + hand.grabStrength + "<br>"
                + "Pinch Strength: " + hand.pinchStrength + "<br><br>";

            var normalizedPalmPosition = frame.interactionBox.normalizePoint(hand.palmPosition, true);

            var palmX = window.innerWidth * normalizedPalmPosition[0] - palmDisplay.offsetWidth / 2;
            palmDisplay.style.left = palmX + "px";

            var palmY = window.innerHeight * (1 - normalizedPalmPosition[1]) - palmDisplay.offsetHeight / 2;
            palmDisplay.style.top = palmY + "px";


        }
        // Get and show finger data
        fingerData.innerHTML = "";
        for (var k = 0; k < frame.fingers.length; k++) {
            var finger = frame.fingers[k];
            fingerData.innerHTML += "Finger ID: " + finger.id + "<br>"
                + "Belong to Hand ID: " + finger.handId + "<br>"
                + "Finger Tip Position: " + finger.tipPosition + "<br>"
                + "Finger Type: " + finger.type + "<br>" + "<br>";
        }
    })
}