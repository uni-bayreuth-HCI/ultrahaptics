using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.IO;
using Ultrahaptics;
using System.Net.WebSockets;

namespace UltrahapticsShapes
{
    class RenderShapes
    {
        public static void NotMain(string[] args)
        {
            string file_type = args[0];
            string file_name = Path.Combine(Environment.CurrentDirectory, "list.csv");
            AmplitudeModulationEmitter emitter = new AmplitudeModulationEmitter();

            float intensity = 1.0f;
            float frequency = 200.0f;

            if(file_type == "CSV")
            {
                for (; ;)
                {
                    using (TextFieldParser parser = new TextFieldParser(file_name))
                    {
                        parser.TextFieldType = FieldType.Delimited;
                        parser.SetDelimiters(",");
                        while (!parser.EndOfData)
                        {
                            double x = 1000, y = 1000, z = 1000;
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
                                else if (z == 1000)
                                {
                                    z = double.Parse(field);
                                }
                            }
                            Vector3 position = new Vector3((float)(x * Ultrahaptics.Units.metres), (float)(y * Ultrahaptics.Units.metres), (float)(z * Ultrahaptics.Units.metres));
                            AmplitudeModulationControlPoint point = new AmplitudeModulationControlPoint(position, intensity, frequency);
                            var points = new List<AmplitudeModulationControlPoint> { point };
                            emitter.update(points);
                        }
                    }
                }

            }
            else if(file_type == "SVG")
            {
                for (; ;)
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
                        }
                    }
                }
            }            
        }
    }
}
