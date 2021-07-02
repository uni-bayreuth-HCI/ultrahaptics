using System;
using System.Net.Sockets;
using System.Net;
using System.Security.Cryptography;
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
            Console.WriteLine(e.Data);
            if (e.Data == "BALUS") {
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
