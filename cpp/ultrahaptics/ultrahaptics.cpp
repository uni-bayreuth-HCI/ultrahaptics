// ultrahaptics.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>

// This example uses the Amplitude Modulation emitter to project a square
// at a fixed distance above the centre of the array

#include <cstdlib>
#include <iostream>
#include <thread>
#include <chrono>

#include <UltrahapticsAmplitudeModulation.hpp>
#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <map>

using std::cout; using std::cerr;
using std::endl; using std::string;
using std::ifstream; using std::ostringstream;
using std::istringstream;

string readFileIntoString(const string& path) {
    auto ss = ostringstream{};
    ifstream input_file(path);
    if (!input_file.is_open()) {
        cerr << "Could not open the file - '"
            << path << "'" << endl;
        exit(EXIT_FAILURE);
    }
    ss << input_file.rdbuf();
    return ss.str();
}

std::map<int, std::vector<string>> readCSV()
{
    string filename("foo.csv");
    string file_contents;
    std::map<int, std::vector<string>> csv_contents;
    char delimiter = ',';

    file_contents = readFileIntoString(filename);

    istringstream sstream(file_contents);
    std::vector<string> items;
    string record;

    int counter = 0;
    while (std::getline(sstream, record)) {
        istringstream line(record);
        while (std::getline(line, record, delimiter)) {
            record.erase(std::remove_if(record.begin(), record.end(), isspace), record.end());
            items.push_back(record);
        }

        csv_contents[counter] = items;
        items.clear();
        counter += 1;
    }



    return csv_contents;
}

int main(int argc, char* argv[])
{
    // Create an emitter.
    Ultrahaptics::AmplitudeModulation::Emitter emitter;

    // Set frequency to 200 Hertz and maximum intensity
    float frequency = 175.0 * Ultrahaptics::Units::hertz;
    float intensity = 1.0f;

    // Position the focal point at 20 centimeters above the array.
    float distance = 15.0 * Ultrahaptics::Units::centimetres;
    std::map<int, std::vector<string>> csv_contents = readCSV();


    for (;;) {
        for (auto mapIt = begin(csv_contents); mapIt != end(csv_contents); ++mapIt)
        {
            float x = 0, y = 0, z = 0;
            for (auto c : mapIt->second)
            {
                if (x == 0) {
                    x = std::stof(c);
                }
                else if (y == 0) {
                    y = std::stof(c);
                }
                else if (z == 0) {
                    z = std::stof(c);
                }
            }

            Ultrahaptics::Vector3 position(x, y, z * Ultrahaptics::Units::centimetres);
            Ultrahaptics::AmplitudeModulation::ControlPoint point(position, intensity, frequency);

            emitter.update(point);

        }
    }




    return 0;
}


// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
