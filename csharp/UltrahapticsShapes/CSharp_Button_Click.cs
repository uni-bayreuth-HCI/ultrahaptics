using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using Ultrahaptics;
using Leap;


public struct ButtonWidget
{
    public float radius;
    public float angle;
    public ButtonWidget(float r = 0.025f, float a = 0.0f){
        radius = r;
        angle = a;
    }
}

public static class MathF
{
    public static Func<double, float> Cos = angleR => (float)Math.Cos(angleR);
    public static Func<double, float> Sin = angleR => (float)Math.Sin(angleR);
}

// This example creates a static focal point at a frequency of 200Hz, 20cm above the device.
public class ButtonExample
{

    const float PI = (float)Math.PI;

    public static void dsfMain(string[] args)
    {
        // Create an emitter, which connects to the first connected device
        AmplitudeModulationEmitter emitter = new AmplitudeModulationEmitter();

        // Create an aligment object which relates the tracking and device spaces
        Alignment alignment = emitter.getDeviceInfo().getDefaultAlignment();

        // Create a Leap Contoller
        Controller controller = new Controller();

        ButtonWidget button = new ButtonWidget();

        // Set the position of the new control point
        Vector3 position = new Vector3(0.0f, 0.0f, 0.2f);
        // Set how intense the feeling at the new control point will be
        float intensity = 1.0f;
        // Set the frequency of the control point, which can change the feeling of the sensation
        float frequency = 200.0f;

        // Define the control point
        AmplitudeModulationControlPoint point = new AmplitudeModulationControlPoint (position, intensity, frequency);
        var points = new List<AmplitudeModulationControlPoint> { point };

        // Wait for leap
        if(!controller.IsConnected)
        {
            Console.WriteLine("Waiting for Leap");
            while (!controller.IsConnected)
            {
                System.Threading.Thread.Sleep(1000);
                Console.WriteLine(".");
            }
            Console.WriteLine("\n");
        }

        controller.EnableGesture (Gesture.GestureType.TYPE_KEY_TAP);

        if(controller.Config.SetFloat("Gesture.Swipe.MinDistance", 30) &&
            controller.Config.SetFloat("Gesture.Swipe.MinDownVelocity", 30) &&
            controller.Config.SetFloat("Gesture.Swipe.MinSeconds", 0.01f))
        {
            controller.Config.Save();
        }

        bool button_on = true;
        new Stopwatch();

        for(;;)
        {
            // Exit if the device has been disconnected
            if (!emitter.isConnected())
                break;

            Frame frame = controller.Frame();
            HandList hands = frame.Hands;

            if(!hands.IsEmpty && button_on)
            {
                Hand hand = hands[0];

                for(int i = 0; i < frame.Gestures().Count; i++)
                {
                    Gesture gesture = frame.Gestures()[i];

                    if(gesture.Type == Gesture.GestureType.TYPE_KEY_TAP)
                    {
                        button_on = false;

                        emitter.stop();
                        break;
                    }
                }
                position = new Vector3(hand.PalmPosition.x, hand.PalmPosition.y, hand.PalmPosition.z);
                Vector3 normal = new Vector3(-hand.PalmNormal.x, -hand.PalmNormal.y, -hand.PalmNormal.z);
                Vector3 direction = new Vector3(hand.Direction.x, hand.Direction.y, hand.Direction.z);

                Vector3 device_position = alignment.fromTrackingPositionToDevicePosition(position);
                Vector3 device_normal = alignment.fromTrackingDirectionToDeviceDirection(normal).normalize();
                Vector3 device_direction = alignment.fromTrackingDirectionToDeviceDirection(direction).normalize();
                Vector3 device_palm_x = device_direction.cross(device_normal).normalize();

                device_position += (device_direction * MathF.Cos(button.angle) + device_palm_x * MathF.Sin(button.angle)) * button.radius;

                points[0].setPosition(device_position);
                // Instruct the device to stop any existing actions and start producing this control point
                emitter.update(points);
                // The emitter will continue producing this point until instructed to stop

                button.angle += 0.05f;
                button.angle = button.angle % (2.0f * PI);
            }
            else if(!hands.IsEmpty && !button_on)
            {
                emitter.stop();

                for(int i = 0; i < frame.Gestures().Count; i++)
                {
                    Gesture gesture = frame.Gestures()[i];

                    if(gesture.Type == Gesture.GestureType.TYPE_KEY_TAP)
                    {
                        button_on = true;

                        emitter.stop();
                        break;
                    }
                }
            }
            else
            {
                emitter.stop();
            }
            System.Threading.Thread.Sleep(10);
        }

        // Dispose/destroy the emitter
        emitter.Dispose();
        emitter = null;

        controller.Dispose ();
    }
}
