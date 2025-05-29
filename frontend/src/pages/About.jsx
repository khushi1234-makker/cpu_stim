import React from 'react';
import { Server, Cpu, Lightbulb, TrendingUp } from 'lucide-react'; // Assuming you're using Lucide React for icons

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-indigo-700 text-white p-6 text-center rounded-t-lg">
          <h1 className="text-4xl font-extrabold mb-2">
            About Our OS Simulator
          </h1>
          <p className="text-indigo-200 text-lg">
            A comprehensive tool for visualizing Operating System concepts.
          </p>
        </div>

        {/* Main Content Section */}
        <div className="p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Lightbulb size={28} className="mr-3 text-yellow-500" />
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              The CPU Scheduling Simulator & Memory Management Simulation is an interactive web-based tool designed to help students, educators, and enthusiasts deeply understand core Operating System concepts. Our goal is to demystify complex algorithms through intuitive visualizations and hands-on experimentation.
            </p>
          </section>

          <hr className="border-gray-200 my-8" />

          {/* CPU Scheduling Simulator Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
              <Cpu size={28} className="mr-3 text-blue-500" />
              CPU Scheduling Simulator
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Explore how your operating system manages concurrent tasks with our CPU Scheduling Simulator. Input various processes, define their arrival times, burst times, and priorities, then watch as our simulator executes them using popular algorithms.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Supported Algorithms: Implement and visualize algorithms like First-Come, First-Served (FCFS), Shortest Job First (SJF), Priority Scheduling, Round Robin, and Shortest Remaining Time Next (SRTN).
              </li>
              <li>
                Dynamic Input:Easily add or remove processes and modify their parameters on the fly.
              </li>
              <li>
                Gantt Chart Visualization:Observe the CPU allocation over time with a clear, interactive Gantt Chart.
              </li>
            </ul>
          </section>

          <hr className="border-gray-200 my-8" />

          {/* Memory Management Simulation Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
              <Server size={28} className="mr-3 text-purple-500" />
              Memory Management Simulation
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dive into the intricacies of memory allocation. Our simulator allows you to configure total memory size and block sizes, then observe how different memory management algorithms allocate space for incoming processes.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Algorithms:Visualize First Fit, Best Fit, and Next Fit algorithms.
              </li>
              <li>
                Interactive Configuration:Set your desired total memory and block sizes to simulate various scenarios.
              </li>
              <li>
              Dynamic Process Additi Add new processes with specified sizes and see how memory is utilized.
              </li>
              <li>
              Memory Visualization (Planned/Implied):Understand fragmentation and memory usage patterns.
              </li>
            </ul>
          </section>

          <hr className="border-gray-200 my-8" />

          {/* Key Features/Benefits */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <TrendingUp size={28} className="mr-3 text-green-500" />
              Why Use Our Simulator?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Interactive LearninLearn by doing and seeing the direct impact of different parameters.</li>
              <li>Educational Tool: Ideal for students studying Operating Systems and professors demonstrating concepts.</li>
              <li>Intuitive Interface Clean, user-friendly design makes complex topics accessible.</li>
              <li>Real-time Visualization: See how algorithms behave dynamically.</li>
            </ul>
          </section>

          <hr className="border-gray-200 my-8" />

          {/* Call to Action / Credits (Optional) */}
          <section className="text-center">
            <p className="text-gray-600 text-lg mb-4">
              Start simulating today and gain a deeper understanding of Operating System principles!
            </p>
            <a 
              href="/" // Link back to your main simulator page
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
            >
              Go to Simulator
            </a>
          </section>

        </div>
      </div>
    </div>
  );
};

export default About;