using System;
using System.Collections.Generic;
using Ultrahaptics;
using Microsoft.VisualBasic.FileIO;
using System.IO;

namespace UltrahapticsShapes
{
    public class AM
    {
        private static bool Stop = false; 
        public static void Stop_Emitter() {
            Stop = true;
        }
        public static void Render()
        {
            string file_name = Path.Combine(Environment.CurrentDirectory, "list.csv");
            AmplitudeModulationEmitter emitter = new AmplitudeModulationEmitter();

            float intensity = 1.0f;
            float frequency = 200.0f;
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
                        Vector3 position = new Vector3((float)(x * Ultrahaptics.Units.metres), (float)(y * Ultrahaptics.Units.metres), (float)(0.15 * Ultrahaptics.Units.metres));
                        AmplitudeModulationControlPoint point = new AmplitudeModulationControlPoint(position, intensity, frequency);
                        var points = new List<AmplitudeModulationControlPoint> { point };
                        emitter.update(points);
                        //this condition will stop emitter from processing further
                        if (Stop)
                        {
                            emitter.stop();
                            emitter.Dispose();
                            emitter = null;
                        }
                    }
                }
            }
        }
    }
}
