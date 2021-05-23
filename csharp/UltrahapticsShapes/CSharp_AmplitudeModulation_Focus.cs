using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using Ultrahaptics;

// This example creates a static focal point at a frequency of 200Hz, 20cm above the device.

public class AMExample
{
    public static void hfhghMain(string[] args)
    {
        // Create an emitter, which connects to the first connected device
        AmplitudeModulationEmitter emitter = new AmplitudeModulationEmitter();

        // Set the position of the new control point
        Vector3 position = new Vector3(0.0f, 0.0f, 0.2f);
        // Set how intense the feeling at the new control point will be
        float intensity = 1.0f;
        // Set the frequency of the control point, which can change the feeling of the sensation
        float frequency = 200.0f;

        // Define the control point
        AmplitudeModulationControlPoint point = new AmplitudeModulationControlPoint (position, intensity, frequency);
        var points = new List<AmplitudeModulationControlPoint> { point };
        // Instruct the device to stop any existing actions and start producing this control point
        bool isOK = emitter.update(points);
        // The emitter will continue producing this point until instructed to stop
        if (isOK)
        {
            // Wait until the program is ready to stop
            Console.ReadKey();
            // Stop the emitter
            emitter.stop();
        }
        else
        {
            // We couldn't use the emitter, so exit immediately
            Console.WriteLine("Could not start emitter.");
        }

        // Dispose/destroy the emitter
        emitter.Dispose();
        emitter = null;
    }
}
