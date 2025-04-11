import homepageImage from './assets/homepage.png';
import { Sprout, Notebook as Robot, ArrowRight, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useState } from 'react';
import { User, Bot, Thermometer, CloudRain, LineChart, Plane } from 'lucide-react';
import Chatbot from './chatbot';
// Ensure the import matches the file name casing
interface Message {
  type: 'user' | 'bot';
  content: string;
}

// Sample data for the graph
const farmData = {
  soilMoisture: [65, 70, 68, 72, 75, 71, 69],
  temperature: [22, 24, 25, 23, 26, 25, 24],
  cropGrowth: [82, 85, 87, 88, 90, 92, 95],
  dailyStats: {
    mon: { moisture: 65, temp: 22, growth: 82 },
    tue: { moisture: 70, temp: 24, growth: 85 },
    wed: { moisture: 68, temp: 25, growth: 87 },
    thu: { moisture: 72, temp: 23, growth: 88 },
    fri: { moisture: 75, temp: 26, growth: 90 },
    sat: { moisture: 71, temp: 25, growth: 92 },
    sun: { moisture: 69, temp: 24, growth: 95 }
  }
};

function App() {
  const [messages] = useState<Message[]>([
    { type: 'user', content: "What's the best time to plant tomatoes?" },
    { type: 'bot', content: "Based on your location's climate data, the ideal planting time is early spring, between March and May. Soil temperature should be at least 60°F (15.5°C)." },
    { type: 'user', content: "How often should I water my crops?" },
    { type: 'bot', content: "It depends on various factors. Our AI monitors soil moisture levels and weather conditions to provide personalized watering schedules for optimal growth." },
    { type: 'user', content: "How can AI help prevent crop diseases?" },
    { type: 'bot', content: "Our AI system uses image recognition and sensor data to detect early signs of diseases, allowing for preventive measures before they spread." },
  ]);
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Farm AI</span>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <a href="#https://farm-ai-nav-links.vercel.app/about" className="px-3 py-2 text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-gray-900">Community</a>
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-gray-900">Resources</a>
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-gray-900">Market Prices</a>
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="#" className="ml-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                AI-Powered<br />Sustainable Farming
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Transform your farming practices with our advanced AI technology.
                Get real-time insights, optimize resources, and grow smarter for a
                sustainable future.
              </p>
              <div className="flex gap-4">
                <button className="flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                  <Robot className="h-5 w-5 mr-2" />
                  Start Growing Smarter
                </button>
                <button className="flex items-center px-6 py-3 border border-gray-300 rounded-md hover:border-gray-400 transition-colors">
                  Learn More
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src={homepageImage} // Use the imported image
                alt="AI Robot in greenhouse"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
    <h1 className="text-4xl font-bold text-center mb-4">Key Features</h1>
    <h1 className="text-xl  text-center mb-10">Advanced tools for modern farming</h1>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Robot className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Insights</h3>
              <p className="text-gray-600">Advanced machine learning algorithms provide real-time analysis and recommendations for optimal crop management.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Sprout className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sustainable Practices</h3>
              <p className="text-gray-600">Implement eco-friendly farming techniques that reduce resource consumption while maximizing yield.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <ArrowRight className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Automation</h3>
              <p className="text-gray-600">Automate routine tasks and monitoring with intelligent systems that adapt to your farm's needs.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">AI Assistant Demo</h1>
          <p className="text-center text-gray-600">See how our AI can help optimize your farming</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Chat Interface */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-4 ${message.type === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'bot' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {message.type === 'bot' ? <Bot className="w-5 h-5 text-blue-600" /> : <User className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className={`flex-1 rounded-2xl p-4 ${message.type === 'bot' ? 'bg-gray-100' : 'bg-green-50'}`}>
                      <p className="text-gray-800">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Farm Image */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden shadow-lg h-full">
              <img 
                src="https://cdn.prod.website-files.com/669eb1086f08fffc3efda56e/66d192149f7d62b6094ac971_66b4d3265d6d2c8dd68a00da_AI_argriculture_mvp_8aa6a72464.webp" 
                alt="AI Farming Robot" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Dashboard Preview - Full Width */}
          <div className="lg:col-span-12 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Live Dashboard Preview</h2>
              <p className="text-gray-600 mt-2">Monitor your farm's performance in real-time with our intuitive dashboard</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Thermometer className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-medium">Soil Health Metrics</h3>
                </div>
                <p className="text-gray-600">Monitor pH levels, moisture content, and nutrient levels</p>
                <div className="mt-4 text-2xl font-semibold text-orange-600">98%</div>
                <div className="text-sm text-gray-500">Optimal conditions</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CloudRain className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium">Weather Forecast</h3>
                </div>
                <p className="text-gray-600">7-day detailed weather predictions for your location</p>
                <div className="mt-4 text-2xl font-semibold text-blue-600">24°C</div>
                <div className="text-sm text-gray-500">Partly cloudy</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <LineChart className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium">Growth Analytics</h3>
                </div>
                <p className="text-gray-600">Track growth rates and yield predictions</p>
                <div className="mt-4 text-2xl font-semibold text-green-600">+12%</div>
                <div className="text-sm text-gray-500">Above average</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Plane className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-medium">Crop Performance</h3>
                </div>
                <p className="text-gray-600">Real-time monitoring of crop health and growth stages</p>
                <div className="mt-4 text-2xl font-semibold text-purple-600">Excellent</div>
                <div className="text-sm text-gray-500">Stage 3 of 5</div>
              </div>
            </div>

            {/* Farm Performance Chart */}
            <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-lg font-medium mb-6">Farm Performance Metrics</h3>
              <div className="h-80 relative">
                {/* Chart Background Grid */}
                <div className="absolute inset-0">
                  <div className="h-full w-full grid grid-rows-5 gap-0">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="border-t border-gray-100 relative">
                        <span className="absolute -left-6 transform -translate-y-1/2 text-xs text-gray-400">
                          {100 - i * 20}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vertical Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-7 gap-px">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="border-r border-gray-100" />
                  ))}
                </div>

                {/* Data Visualization */}
                <div className="absolute inset-0 p-4">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    {/* Soil Moisture Line */}
                    <path
                      d={`M ${Object.values(farmData.dailyStats).map((stat, i) => 
                        `${(i * (100 / 6))}% ${100 - stat.moisture}%`).join(' L ')}`}
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.8)"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    {/* Data Points */}
                    {Object.values(farmData.dailyStats).map((stat, i) => (
                      <circle
                        key={`moisture-${i}`}
                        cx={`${i * (100 / 6)}%`}
                        cy={`${100 - stat.moisture}%`}
                        r="4"
                        fill="rgb(59, 130, 246)"
                        className="transition-all duration-300"
                      />
                    ))}

                    {/* Temperature Line */}
                    <path
                      d={`M ${Object.values(farmData.dailyStats).map((stat, i) => 
                        `${(i * (100 / 6))}% ${100 - (stat.temp * 2)}%`).join(' L ')}`}
                      fill="none"
                      stroke="rgba(249, 115, 22, 0.8)"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    {/* Data Points */}
                    {Object.values(farmData.dailyStats).map((stat, i) => (
                      <circle
                        key={`temp-${i}`}
                        cx={`${i * (100 / 6)}%`}
                        cy={`${100 - (stat.temp * 2)}%`}
                        r="4"
                        fill="rgb(249, 115, 22)"
                        className="transition-all duration-300"
                      />
                    ))}

                    {/* Growth Line */}
                    <path
                      d={`M ${Object.values(farmData.dailyStats).map((stat, i) => 
                        `${(i * (100 / 6))}% ${100 - stat.growth}%`).join(' L ')}`}
                      fill="none"
                      stroke="rgba(34, 197, 94, 0.8)"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    {/* Data Points */}
                    {Object.values(farmData.dailyStats).map((stat, i) => (
                      <circle
                        key={`growth-${i}`}
                        cx={`${i * (100 / 6)}%`}
                        cy={`${100 - stat.growth}%`}
                        r="4"
                        fill="rgb(34, 197, 94)"
                        className="transition-all duration-300"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between mt-4 px-4 text-sm text-gray-500">
                {Object.keys(farmData.dailyStats).map((day) => (
                  <span key={day} className="capitalize">{day}</span>
                ))}
              </div>

              {/* Legend */}
              <div className="flex gap-6 mt-6 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm text-gray-600">Soil Moisture (%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span className="text-sm text-gray-600">Temperature (°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-600">Crop Growth (%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Chatbot />

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Sprout className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-xl font-semibold">FarmAI</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing agriculture through artificial intelligence and sustainable practices.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Our Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Knowledge Base</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-400">123 Innovation Drive, AgTech Valley, CA 94025</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-400">contact@farmai.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 FarmAI. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* <AssistantPanel /> */}
    </div>
  );
}

export default App;
