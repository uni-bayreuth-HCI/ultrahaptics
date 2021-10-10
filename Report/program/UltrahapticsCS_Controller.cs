using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UltrahapticsShapes;

namespace UltrahapticsShapes
{
    class UltrahapticsCS_Controller
    {
        public static void Main(string[] args) {
            WebsocketOrchestrator.StartWebsocket();
        }
    }
}
