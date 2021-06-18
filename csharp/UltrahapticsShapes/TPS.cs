using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.IO;
using Ultrahaptics;
using System.Net.WebSockets;

namespace UltrahapticsShapes
{
    class TPS
    {
        static TimePointStreamingEmitter _emitter;

        static uint _current = 0;
        static uint _timepoint_count = 0;

        static Vector3[] _positions;
        static float[] _intensities;

        public static void Main(string[] args)
        {
            //string file_type = args[0];
            //AmplitudeModulationRandomShapesFromPoints("SVG");
            TpsRandomShapsFromPoints();
        }

        public static void AmplitudeModulationRandomShapesFromPoints(string file_type)
        {
            string file_name = Path.Combine(Environment.CurrentDirectory, "list.csv");
            AmplitudeModulationEmitter emitter = new AmplitudeModulationEmitter();

            float intensity = 1.0f;
            float frequency = 200.0f;

            if (file_type == "CSV")
            {
                for (; ; )
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
            else if (file_type == "SVG")
            {
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
                        }
                    }
                }
            }

        }

        public static void TpsRandomShapsFromPoints()
        {
            // Create a timepoint streaming emitter
            // Note that this automatically attempts to connect to the device, if present
            _emitter = new TimePointStreamingEmitter();
            // Inform the SDK how many control points you intend to use
            // This also calculates the resulting sample rate in Hz, which is returned to the user
            uint sample_rate = _emitter.setMaximumControlPointCount(1);
            float desired_frequency = 200.0f;
            // From here, we can establish how many timepoints there are in a single "iteration" of the cosine wave
            _timepoint_count = (uint)(sample_rate / desired_frequency);

            _positions = CSVtoVector();
            _intensities = new float[_positions.Length];

            // Populate the positions and intensities ahead of time, so that the callback is as fast as possible later
            // Modulate the intensity to be a complete cosine waveform over the full set of points.
            for (int i = 0; i < _positions.Length; i++)
            {
                float intensity = 0.5f * (1.0f - (float)Math.Cos(2.0f * Math.PI * i / _positions.Length));
                // Set a constant position of 20cm above the array
                //_positions[i] = new Vector3(0.0f, 0.0f, 0.2f);
                _intensities[i] = (1.0f);
            }

            // Set our callback to be called each time the device is ready for new points
            _emitter.setEmissionCallback(Callback, null);
            // Instruct the device to call our callback and begin emitting
            bool isOK = _emitter.start();

            if (isOK)
            {
                // Wait until the program is ready to stop
                Console.ReadKey();
                // Stop the emitter
                _emitter.stop();
            }
            else
            {
                // We couldn't use the emitter, so exit immediately
                Console.WriteLine("Could not start emitter.");
            }

            // Dispose/destroy the emitter
            _emitter.Dispose();
            _emitter = null;

        }

        static void Callback(TimePointStreamingEmitter emitter, OutputInterval interval, TimePoint deadline, object user_obj)
        {
            // For each time point in this interval...
            foreach (var tpoint in interval)
            {
                // For each control point available at this time point...
                for (int i = 0; i < tpoint.count(); ++i)
                {
                    // Set the relevant data for this control point
                    var point = tpoint.persistentControlPoint(i);
                    point.setPosition(_positions[_current]);
                    point.setIntensity(_intensities[_current]);
                    point.enable();
                }
                // Increment the counter so that we get the next "step" next time
                _current = (_current + 1) % (uint)_positions.Length;
            }
        }

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