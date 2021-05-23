// This example uses the Amplitude Modulation emitter to project a square
// at a fixed distance above the centre of the array
#include <cstdlib>
#include <iostream>
#include <thread>
#include <chrono>
#include <UltrahapticsAmplitudeModulation.hpp>
struct Square
{
    double side_length = 80.0 * Ultrahaptics::Units::mm;
    double period = 1;
};
enum Side_Index {
    LEFT_SIDE,
    TOP_SIDE,
    RIGHT_SIDE,
    BOTTOM_SIDE,
    REPEAT
};
int zmain(int argc, char* argv[])
{
    // Create an emitter.
    Ultrahaptics::AmplitudeModulation::Emitter emitter;
    // Set frequency to 200 Hertz and maximum intensity
    float frequency = 200.0 * Ultrahaptics::Units::hertz;
    float intensity = 1.0f;
    // Position the focal point at 20 centimeters above the array.
    float distance = 20.0 * Ultrahaptics::Units::centimetres;
    // Optionally, specify the height of the square in cm on the command line
    if (argc > 1)
    {
        distance = atof(argv[1]) * Ultrahaptics::Units::centimetres;
    }
    Square sqr;
    Side_Index side = LEFT_SIDE;
    Ultrahaptics::Vector3 position1(-sqr.side_length / 2, -sqr.side_length / 2, distance);
    Ultrahaptics::AmplitudeModulation::ControlPoint point1(position1, intensity, frequency);
    Ultrahaptics::Vector3 start_position = position1;
    unsigned iterations = 0;
    int side_resolution = 100;
    auto wait_time_ms = (int)(1000 * sqr.period / (4 * side_resolution));
    for (;;) {
        emitter.update(point1);
        if (side == LEFT_SIDE) {
            position1.y += sqr.side_length / side_resolution;
            point1.setPosition(position1);
        }
        else if (side == TOP_SIDE) {
            position1.x += sqr.side_length / side_resolution;
            point1.setPosition(position1);;
        }
        else if (side == RIGHT_SIDE) {
            position1.y -= sqr.side_length / side_resolution;
            point1.setPosition(position1);
        }
        else if (side == BOTTOM_SIDE) {
            position1.x -= sqr.side_length / side_resolution;
            point1.setPosition(position1);
        }
        iterations++;
        if (iterations % side_resolution == 0 && iterations != 0) {
            iterations = 0;
            side = (Side_Index)((unsigned)side + 1);
            if (side == REPEAT)
                side = LEFT_SIDE;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(wait_time_ms));
    }
    return 0;
}
