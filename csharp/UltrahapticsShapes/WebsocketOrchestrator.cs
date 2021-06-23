using System;
using System.Net.Sockets;
using System.Net;
using System.Security.Cryptography;
using System.Threading;

using WebSocketSharp;
using WebSocketSharp.Server;

namespace UltrahapticsShapes
{
    
    public class Laputa : WebSocketBehavior
    {
        protected override void OnMessage(MessageEventArgs e)
        {
            var msg = e.Data == "BALUS"
                        ? "I've been balused already..."
                        : "I'm not available now.";

            Send(msg);
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
