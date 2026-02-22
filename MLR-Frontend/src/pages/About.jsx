import React from 'react';
import asfiyaImg from "../assets/team/asfiya.jpg";
import chaityaImg from "../assets/team/Chaitnya.jpeg";
import gauravImg from "../assets/team/gaurav.jpeg";
import snehalImg from "../assets/team/snehal_shinde.jpeg";
import tejasImg from "../assets/team/tejas.png";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About UPI Wallet & Money Leakage Radar
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Revolutionizing digital payments with intelligent financial monitoring
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="card card-hover p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h4>
            <p className="text-gray-600 dark:text-gray-300">
              To provide a secure, intelligent digital wallet that empowers users with 
              real-time financial insights and proactive money leakage detection.
            </p>
          </div>
          
          <div className="card card-hover p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Vision</h4>
            <p className="text-gray-600 dark:text-gray-300">
              To become the leading platform for smart financial management, 
              helping millions prevent financial losses through Rule based analytics.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bank-Level Security</h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Advanced encryption and security protocols</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Rule Based Detection</h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Smart algorithms detect unusual patterns</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Real-Time Analytics</h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Instant insights into spending patterns</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6.5a2.5 2.5 0 010-5H11m0 5a2 2 0 002-2V9a2 2 0 00-2-2m0 12V9m0 0H9m2 0h2" />
                </svg>
              </div>
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Alerts</h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Immediate notifications for suspicious activity</p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="card mb-16">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Built with Modern Technology</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <h6 className="font-semibold text-primary-500 mb-2">Frontend</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400">React 18, Tailwind CSS, Chart.js</p>
              </div>
              <div>
                <h6 className="font-semibold text-primary-500 mb-2">Backend</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400">ASP.NET Core/Spring Boot</p>
              </div>
              <div>
                <h6 className="font-semibold text-primary-500 mb-2">Database</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400">MySQL, Entity Framework/Spring JPA</p>
              </div>
              <div>
                <h6 className="font-semibold text-primary-500 mb-2">Analytics</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400"> Chart.js</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-12">Our Team</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
            <div className="text-center">
              <img
                src={asfiyaImg}
                alt="Asfiya Shaikh"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h6 className="font-semibold text-gray-900 dark:text-white">Asfiya Shaikh</h6>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Full Stack Developer</p>
              <a href="https://www.linkedin.com/in/er-asfiya-s-7b06a7213" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
                <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            
            <div className="text-center">
              <img
                src={chaityaImg}
                alt="Chinmay Bonde"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h6 className="font-semibold text-gray-900 dark:text-white">Chinmay Bonde</h6>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Full Stack Developer</p>
              <a href="https://www.linkedin.com/in/chinmaybonde10" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
                <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            
            <div className="text-center">
              <img
                src={gauravImg}
                alt="Gaurav Salunkhe"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h6 className="font-semibold text-gray-900 dark:text-white">Gaurav Salunkhe</h6>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Full Stack Developer</p>
              <a href="https://www.linkedin.com/in/gaurav-1234567890" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
                <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            
            <div className="text-center">
              <img
                src={snehalImg}
                alt="Snehal Shinde"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h6 className="font-semibold text-gray-900 dark:text-white">Snehal Shinde</h6>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Full Stack Developer</p>
              <a href="https://www.linkedin.com/in/snehal-shinde-b267091a5/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
                <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            
            <div className="text-center">
              <img
                src={tejasImg}
                alt="Tejas Jadhav"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h6 className="font-semibold text-gray-900 dark:text-white">Tejas Jadhav</h6>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Full Stack Developer</p>
              <a href="https://www.linkedin.com/in/tejas-jadhao-993656291" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
                <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We are a dedicated team of developers and designers building a secure and intelligent UPI wallet system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;