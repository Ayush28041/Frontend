import React from 'react';
import { Building, Clock, Calendar, BarChart4, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold mb-4">Simplify Meeting Room Management with MeetingHub</h1>
              <p className="text-xl mb-8">The smart way to book, manage, and track meeting spaces across your organization.</p>
              <div className="flex space-x-4">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-blue-50">Get Started</button>
                <button className="border border-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700">Learn More</button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-blue-500 p-8 rounded-lg shadow-xl flex flex-col items-center">
                <img src="data:image/jpeg;base64,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" alt="Meeting room booking dashboard" className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MeetingHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 text-blue-600">
                <Clock size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Availability</h3>
              <p className="text-gray-600">Check room availability instantly and book spaces with just a few clicks.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 text-blue-600">
                <Calendar size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">Easily schedule recurring meetings and get reminders for upcoming bookings.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 text-blue-600">
                <Building size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-location Support</h3>
              <p className="text-gray-600">Manage rooms across different office locations from a single platform.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-3/4 mb-8 md:mb-0">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnId4e7fX8vjFjU0t1-7hHUwM8Rsvi6CEMtg&s" alt="Office meeting" className="w-full rounded-lg shadow-lg" />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">Boost Workplace Efficiency</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-4">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Reduce Booking Conflicts</h3>
                    <p className="text-gray-600">Eliminate double-bookings and confusion with our real-time system.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-4">
                    <BarChart4 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Optimize Space Utilization</h3>
                    <p className="text-gray-600">Detailed analytics help you make data-driven decisions about your workspace.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Forward-Thinking Companies</h2>
          <div className="max-w-3xl mx-auto bg-blue-700 p-8 rounded-lg shadow-lg">
            <p className="text-xl italic mb-6">"MeetingHub transformed our office space management. We've seen a 40% increase in meeting room efficiency since implementing the system."</p>
            <div>
              <p className="font-semibold text-lg">Sarah Johnson</p>
              <p className="text-blue-200">Facilities Manager, TechCorp Inc.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your workplace?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Join hundreds of companies that have simplified their meeting room management with MeetingHub.</p>
        </div>
      </div>
    </div>
  );
}