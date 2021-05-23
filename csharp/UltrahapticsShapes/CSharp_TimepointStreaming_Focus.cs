using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using Ultrahaptics;

// This example creates a static focal point at 20cm above the device.
// The modulation in this example is a simple cosine wave at 200Hz,
// similar to the amplitude modulation emitter's functionality.

class TSExample
{
    static TimePointStreamingEmitter _emitter;

    static uint _current = 0;
    static uint _timepoint_count = 0;

    static Vector3[] _positions;
    static float[] _intensities;

    public static void notMain(string[] args)
    {
        // Create a timepoint streaming emitter
        // Note that this automatically attempts to connect to the device, if present
        _emitter = new TimePointStreamingEmitter();
        // Inform the SDK how many control points you intend to use
        // This also calculates the resulting sample rate in Hz, which is returned to the user
        uint sample_rate = _emitter.setMaximumControlPointCount (1);
        float desired_frequency = 200.0f;
        // From here, we can establish how many timepoints there are in a single "iteration" of the cosine wave
        _timepoint_count = (uint)(sample_rate / desired_frequency);

        _positions = new Vector3[_timepoint_count];
        _intensities = new float[_timepoint_count];

        // Populate the positions and intensities ahead of time, so that the callback is as fast as possible later
        // Modulate the intensity to be a complete cosine waveform over the full set of points.
        for (int i = 0; i < _timepoint_count; i++)
        {
            float intensity = 0.5f * (1.0f - (float)Math.Cos(2.0f * Math.PI * i / _timepoint_count));
            // Set a constant position of 20cm above the array
            _positions[i] = new Vector3(0.0f, 0.0f, 0.2f);
            _intensities[i] = (intensity);
        }

        // Set our callback to be called each time the device is ready for new points
        _emitter.setEmissionCallback(callback, null);
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

    // This callback is called every time the device is ready to accept new control point information
    static void callback(TimePointStreamingEmitter emitter, OutputInterval interval, TimePoint deadline, object user_obj)
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
            _current = (_current + 1) % _timepoint_count;
        }
    }
}
