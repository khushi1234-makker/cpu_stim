import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 p-6">
      {/* Title Section */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-6 text-center">
        OS Process & Memory Simulator
      </h1>
      <p className="text-lg text-gray-600 mb-10 text-center">
        A powerful tool to visualize CPU Scheduling & Memory Management algorithms.
      </p>

      {/* CPU Scheduling Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Simulate CPU Scheduling</h2>
        <p className="text-gray-600 mb-6">Experience various CPU scheduling algorithms.</p>
        <Link 
          to="/Docs"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 transition duration-300"
        >
          Start Simulation
        </Link>
      </div>

      {/* Memory Management Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Simulate Memory Management</h2>
        <p className="text-gray-600 mb-6">Explore paging, segmentation, and memory allocation.</p>
        <Link 
          to="/MemorySimulation"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 transition duration-300"
        >
          Start Simulation
        </Link>
      </div>
    </div>
  );
};

export default Home;
