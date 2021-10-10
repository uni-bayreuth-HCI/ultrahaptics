using System;
using System.Collections.Generic;
using Ultrahaptics;
using Microsoft.VisualBasic.FileIO;
using System.IO;
using System.Threading;

namespace UltrahapticsShapes
{

    /**
     * Ultrahaptics Amplitude modulation class. 
     * All amplitude modulation rendering takes place from this class
     * */
    public class AM
    {
        private static bool Stop = false; //boolean to stop the emitter
        private static AmplitudeModulationEmitter emitter;
        private static  float intensity = 1.0f;
        private static float frequency = 200.0f;

        public static void Stop_Emitter() {
            Stop = true;
        }
        public static void Render()
        {
            Stop = false;
            string file_name = Path.Combine(Environment.CurrentDirectory, "list.csv");
            emitter = new AmplitudeModulationEmitter();

            
            for (; ; )
            {
                using (TextFieldParser parser = new TextFieldParser(file_name))
                {
                    parser.TextFieldType = FieldType.Delimited;
                    parser.SetDelimiters(",");
                    while (!parser.EndOfData)
                    {
                        double x = 1000, y = 1000;
                        //Processing row
                        string[] fields = parser.ReadFields();
                        foreach (string field in fields)
                        {
                            //TODO: Process field
                            if (x == 1000)
                            {
                                x = double.Parse(field);
                            }
                            else if (y == 1000)
                            {
                                y = double.Parse(field);
                            }
                        }
                        Vector3 position = new Vector3((float)(x * Ultrahaptics.Units.metres), (float)(y * Ultrahaptics.Units.metres), (float)(0.20 * Ultrahaptics.Units.metres));
                        AmplitudeModulationControlPoint point = new AmplitudeModulationControlPoint(position, intensity, frequency);
                        var points = new List<AmplitudeModulationControlPoint> { point };
                        emitter.update(points);
                        
                        //this condition will stop emitter from processing further
                        if (Stop)
                        {
                            emitter.update(new List<AmplitudeModulationControlPoint> {});

                            emitter.Dispose();
                            emitter = null;
                            Stop = false;
                            return;
                        }
                    }
                }
            }
        
        }
        /// <summary>
        /// Starts the live ultrahaptics rendering
        /// Note: live ultrahaptics rendering of a point always happrns in AM and is never implemented in TPS
        /// </summary>
        public static void RenderLive()
        {
            Stop = false;
            emitter = new AmplitudeModulationEmitter();
            Vector3 position = new Vector3((float)(0 * Ultrahaptics.Units.metres), (float)(0 * Ultrahaptics.Units.metres), (float)(0.20 * Ultrahaptics.Units.metres));
            AmplitudeModulationControlPoint point = new AmplitudeModulationControlPoint(position, intensity, frequency);
            var points = new List<AmplitudeModulationControlPoint> { point };
            emitter.update(points);
        }

        /// <summary>
        /// this function is to update the live rendering points which comes from ultraleap live rendering feature
        /// </summary>
        /// <param name="updated_x"> the new x coordinate</param>
        /// <param name="updated_y"> the new y coordinate</param>
        public static void updateLiveRenderPoint(float updated_x, float updated_y) {
            if (emitter != null) {
                Vector3 position = new Vector3((float)(updated_x * Ultrahaptics.Units.metres), (float)(updated_y * Ultrahaptics.Units.metres), (float)(0.20 * Ultrahaptics.Units.metres));
                AmplitudeModulationControlPoint point = new AmplitudeModulationControlPoint(position, intensity, frequency);
                var points = new List<AmplitudeModulationControlPoint> { point };
                emitter.update(points);
                Console.WriteLine(updated_x + " " + updated_y);
            }
            if (Stop)
            {
                try {
                    emitter.update(new List<AmplitudeModulationControlPoint> { });
                    emitter.Dispose();
                    emitter = null;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                }
                
                Stop = false;
                return;
            }

        }
    }
}
