// This example uses the Timepoint Streaming emitter to project a control point
// moving in a circle 20 cm above the centre of the array.
#include <cmath>
#include <iostream>
#include <chrono>
#include <thread>
#include <string>
#include "UltrahapticsTimePointStreaming.hpp"
#ifndef M_PI
#define M_PI 3.14159265358979323
#endif
using Seconds = std::chrono::duration<float>;
static auto start_time = std::chrono::steady_clock::now();
// Structure for passing information on the type of point to create
struct Square
{
    // The position of the control point
    Ultrahaptics::Vector3 position;
    // The intensity of the control point
    float intensity;
    // The radius of the circle
    double side_length;
    // The frequency with which the control point goes around the square
    double square_frequency;
    void evaluateAt(Seconds t) {
        double fraction = t.count() * square_frequency;
        fraction -= (long)fraction;
        if (fraction <= 0.25) {
            position.x = -side_length / 2;
            position.y = (-side_length / 2) + (4 * fraction * side_length);
        }
        else if (fraction > 0.25 && fraction <= 0.5) {
            position.x = (-side_length / 2) + (4 * (fraction - 0.25) * side_length);
            position.y = side_length / 2;
        }
        else if (fraction > 0.5 && fraction <= 0.75) {
            position.x = side_length / 2;
            position.y = (side_length / 2) - (4 * (fraction - 0.5) * side_length);
        }
        else {
            position.x = (side_length / 2) - (4 * (fraction - 0.75) * side_length);
            position.y = -side_length / 2;
        }
    }
};
// Callback function for filling out complete device output states through time
void my_emitter_callback(const Ultrahaptics::TimePointStreaming::Emitter& timepoint_emitter,
    Ultrahaptics::TimePointStreaming::OutputInterval& interval,
    const Ultrahaptics::HostTimePoint& submission_deadline,
    void* user_pointer)
{
    // Cast the user pointer to the struct that describes the control point behaviour
    Square* square = static_cast<Square*>(user_pointer);
    // Loop through the samples in this interval
    for (auto& sample : interval)
    {
        Seconds t = sample - start_time;
        square->evaluateAt(t);
        // Set the position and intensity of the persistent control point to that of the modulated wave at this point in time.
        sample.persistentControlPoint(0).setPosition(square->position);
        sample.persistentControlPoint(0).setIntensity(square->intensity);
    }
}
int main(int argc, char* argv[])
{
    // Create a time point streaming emitter
    Ultrahaptics::TimePointStreaming::Emitter emitter;
    // Set the maximum control point count
    emitter.setMaximumControlPointCount(1);
    // Create a structure containing our control point data and fill it in
    Square square;
    // Set control point 20cm above the array at the bottom left corner of the square
    square.position = Ultrahaptics::Vector3(0, 0, 15.0f * Ultrahaptics::Units::centimetres);
    // Set the amplitude of the modulation of the wave to one (full modulation depth)
    square.intensity = 1.0f;
    // Set the radius of the circle that the point is traversing
    square.side_length = 8.0f * Ultrahaptics::Units::centimetres;
    // Set how many times the point traverses the circle every second
    square.square_frequency = 100.0f;
    // Set the callback function to the callback written above
    emitter.setEmissionCallback(my_emitter_callback, &square);
    // Start the array
    emitter.start();
    // Wait for enter key to be pressed.
    std::cout << "Hit ENTER to quit..." << std::endl;
    std::string line;
    std::getline(std::cin, line);
    // Stop the array
    emitter.stop();
    return 0;
}
