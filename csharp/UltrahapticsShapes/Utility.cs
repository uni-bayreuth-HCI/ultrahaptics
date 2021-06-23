using System;
using Microsoft.VisualBasic.FileIO;
using System.IO;
using Ultrahaptics;

namespace UltrahapticsShapes
{
    public class Utility
    {

        public static Vector3[] CSVtoVector()
        {
            string file_name = Path.Combine(Environment.CurrentDirectory, "list.csv");
            Vector3[] positions = new Vector3[File.ReadAllLines(file_name).Length];
            int i = 0;
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
                    positions[i] = new Vector3((float)(x * Units.metres), (float)(y * Units.metres), (float)(0.2 * Units.metres));
                    i++;
                }
            }
            return positions;
        }
    }
}
