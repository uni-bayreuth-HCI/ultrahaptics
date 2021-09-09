
export default function cs_websocket() {
    let ws = new WebSocket('ws://localhost:8080/ultrahaptics');
    ws.onopen=()=> {
        ws.send("BALUS");
    }
    ws.onmessage = (evt)=>  {
        
        var received_msg = evt.data;
        // alert("Message received = "+ received_msg);
        toastr["success"](received_msg, "Ultrahaptics")
    };
    ws.onclose =()=> {
        
        setTimeout(function() {window.ocs_websocket = cs_websocket();}, 5000)
    };

    return {
        send_message : (data) => {
            if(ws) {
                ws.send(JSON.stringify(data))
            }
            
        },

    }
};
