using System;
using Ultrahaptics;


namespace UltrahapticsShapes
{
    /**
     * Ultrahaptics Amplitude modulation class. 
     * All amplitude modulation rendering takes place from this class
     * */
    class TPS
    {
        private static TimePointStreamingEmitter _emitter;

        static uint _current = 0;
        static uint _timepoint_count = 0;

        static Vector3[] _positions;
        static float[] _intensities;
        private static bool Stop = false;
        public static void Stop_Emitter()
        {
            if (_emitter != null) {
                _emitter.stop();
                _emitter.Dispose();
                _emitter = null;
            }
            

        }
        public static void Render()
        {
            Stop = false;
            // Create a timepoint streaming emitter
            // Note that this automatically attempts to connect to the device, if present
            _emitter = new TimePointStreamingEmitter();
            // Inform the SDK how many control points you intend to use
            // This also calculates the resulting sample rate in Hz, which is returned to the user
            uint sample_rate = _emitter.setMaximumControlPointCount(1);
            float desired_frequency = 200.0f;
            // From here, we can establish how many timepoints there are in a single "iteration" of the cosine wave
            _timepoint_count = (uint)(sample_rate / desired_frequency);

            _positions = Utility.CSVtoVector();
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
            _emitter.start();
        }

        static void Callback(TimePointStreamingEmitter emitter, OutputInterval interval, TimePoint deadline, object user_obj)
        {
            
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
    }
}