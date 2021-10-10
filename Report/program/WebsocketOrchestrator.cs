using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using WebSocketSharp;
using WebSocketSharp.Server;
using Newtonsoft.Json;

namespace UltrahapticsShapes
{

    public class Laputa : WebSocketBehavior
    {
        protected override void OnMessage(MessageEventArgs e)
        {
            
            if (e.Data == "BALUS") {
                Console.WriteLine(e.Data);
                Send("You are connected to ultrahaptics");
                return;
            }
            
            Dictionary<string,string> Json_message = JsonConvert.DeserializeObject<Dictionary<string, string>>(e.Data);

            if (Json_message["type"] == "TPS") {
                Task.Factory.StartNew(() => TPS.Render());
                Send("Check Ultrahaptics device!");
            }

            if (Json_message["type"] == "AM")
            {
                Task.Factory.StartNew(() => AM.Render());
                Send("Check Ultrahaptics device!");
            }
            if (Json_message["type"] == "leap-live-start") {
                
                Task.Factory.StartNew(() => AM.RenderLive());
            }

            if (Json_message["type"] == "leap-live-update")
            {

                AM.updateLiveRenderPoint(float.Parse(Json_message["X"]), float.Parse(Json_message["Y"]));

            }

            if (Json_message["type"] == "stop") {
                AM.Stop_Emitter();
                TPS.Stop_Emitter();
            }


            if (Json_message["type"] == "leap-data") { 

            }
        }
    }

    public class WebsocketOrchestrator
    {
        public static void StartWebsocket()
        {
            var wssv = new WebSocketServer("ws://localhost:8080");
            wssv.AddWebSocketService<Laputa>("/ultrahaptics");
            wssv.Start();
            Console.ReadKey(true);
            wssv.Stop();
        }
    }    
}
