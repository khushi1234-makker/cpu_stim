import React from "react";
import { useNavigate } from "react-router-dom";


const Docs = () => {
  const navigate = useNavigate();
  const goToSimulation = (algorithm) => {
    navigate(`/simulator/${algorithm}`);
  };

  return (
    <>
      <div className="bg-gray-900 min-h-screen text-white ">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white py-4 px-6 shadow-md z-20 flex justify-between">
          <h1 className="text-xl font-bold">OS LAB</h1>
          <div className="space-x-6">
            <a href="/" className="hover:text-blue-400">
              HOME
            </a>
            <a href="/docs" className="hover:text-blue-400">
              DOCS
            </a>
            <a href="/about" className="hover:text-blue-400">
              ABOUT
            </a>
          </div>
        </nav>
        {/* Hero Section */}
        <header className="bg-blue-900 py-16 text-center mt-2">
          <h1 className="text-4xl font-semibold pt-5">CPU Scheduling</h1>
        </header>
        {/* Content Section */}
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 text-gray-900 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            What is CPU Scheduling?
          </h2>
          <p className="text-lg">
            CPU Scheduling is a process of determining which process will own
            the CPU for execution while another process is on hold. The main
            task of CPU scheduling is to ensure that whenever the CPU is idle,
            the OS selects a process from the ready queue for execution. The
            selection process is handled by the CPU scheduler.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 text-gray-900 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">
            Types of CPU Scheduling Algorithm
          </h2>
          <p className="text-lg mb-4">
            There are mainly six types of process scheduling algorithms:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>First Come First Serve (FCFS)</li>
            <li>Shortest-Job-First (SJF) Scheduling</li>
            <li>Shortest Remaining Time</li>
            <li>Priority Scheduling</li>
            <li>Round Robin Scheduling</li>
            <li>Multilevel Queue Scheduling</li>
          </ul>
        </div>
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 text-gray-900 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            1) Shortest Job First (SJF)
          </h2>
          <p className="text-lg mb-4">
            Shortest Job First (SJF) is a non-preemptive CPU scheduling
            algorithm where the process with the smallest burst time is executed
            first. It minimizes the average waiting time by prioritizing shorter
            processes.
          </p>

          {/* Advantages */}
          <h3 className="text-xl font-semibold mt-4 mb-2">• Advantages</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>
              SJF is optimal in reducing average waiting time compared to other
              scheduling algorithms.
            </li>
            <li>
              It ensures that smaller tasks complete faster, improving
              responsiveness.
            </li>
          </ul>

          {/* Disadvantages */}
          <h3 className="text-xl font-semibold mt-4 mb-2">• Disadvantages</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>
              SJF suffers from starvation, as longer processes may be
              indefinitely delayed.
            </li>
            <li>
              It is not suitable for real-time systems since process execution
              time is not always known in advance.
            </li>
          </ul>
          {/* Start Simulation Button */}
          <div className="text-center mt-6">
            <button
             onClick={() => goToSimulation('sjf')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg shadow-md hover:bg-blue-600"
            >
              Start Simulation
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 text-gray-900 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            2) Shortest Remaining Time Next
          </h2>
          <p className="text-lg mb-4">
            The full form of SRTN is Shortest Remaining Time Next. It is also
            known as SJF preemptive scheduling. In this method, the process will
            be allocated to the task which is closest to its completion. This
            method prevents a newer ready-state process from holding the
            completion of an older process.
          </p>

          {/* Advantages */}
          <h3 className="text-xl font-semibold mt-4 mb-2">• Advantages</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>
              The main advantage of the SRTN algorithm is that it makes the
              processing of jobs faster than the SJF algorithm, and its overhead
              charges are not counted.
            </li>
          </ul>

          {/* Disadvantages */}
          <h3 className="text-xl font-semibold mt-4 mb-2">• Disadvantages</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>
              In SRTN, context switching is done a lot more times than in SJF
              due to more consumption of the CPU’s valuable time for processing.
              The consumed time of the CPU adds up to its processing time, which
              diminishes the advantage of fast processing.
            </li>
          </ul>
          {/* Start Simulation Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => goToSimulation('srtn')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg shadow-md hover:bg-blue-600"
            >
              Start Simulation
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 text-gray-900 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            3) First Come, First Serve (FCFS)
          </h2>
          <p className="text-lg mb-4">
            First Come, First Serve (FCFS) is the simplest CPU scheduling
            algorithm. In this method, the process that arrives first in the
            ready queue is executed first. It follows a non-preemptive approach,
            meaning that once a process starts executing, it cannot be
            interrupted until it completes.
          </p>

          {/* Advantages */}
          <h3 className="text-xl font-semibold mt-4 mb-2">• Advantages</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Simple and easy to implement.</li>
            <li>
              Fair to all processes as they get executed in order of arrival.
            </li>
            <li>
              Works well for batch processing where process execution time is
              known.
            </li>
          </ul>

          {/* Disadvantages */}
          <h3 className="text-xl font-semibold mt-4 mb-2">• Disadvantages</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>
              Longer processes can cause convoy effect, delaying shorter
              processes.
            </li>
            <li>
              Poor utilization of CPU if a long process blocks others from
              executing.
            </li>
            <li>Non-preemptive, meaning it cannot prioritize urgent tasks.</li>
          </ul>
          {/* Start Simulation Button */}
          <div className="text-center mt-6">
            <button
             onClick={() => goToSimulation('fcfs')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg shadow-md hover:bg-blue-600"
            >
              Start Simulation
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 text-gray-900 rounded-lg shadow-md mb-3 ">
          <h2 className="text-2xl font-semibold mb-4">
            4) Priority Scheduling
          </h2>
          <p className="text-lg mb-4">
            Priority Scheduling is a CPU scheduling algorithm in which each
            process is assigned a priority. The process with the highest
            priority is executed first, while lower-priority processes wait. If
            two processes have the same priority, they are scheduled according
            to their arrival time.
          </p>

          {/* Advantages */}
          <h3 className="text-xl font-semibold mt-4 mb-2">• Advantages</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>
              Efficient for systems where some processes need to be executed
              immediately.
            </li>
            <li>Reduces waiting time for high-priority processes.</li>
          </ul>

          {/* Disadvantages */}
          <h3 className="text-xl font-semibold mt-4 mb-2">• Disadvantages</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>
              Can lead to starvation, where low-priority processes may never
              execute.
            </li>
            <li>Requires a complex priority assignment mechanism.</li>
          </ul>
          {/* Start Simulation Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => goToSimulation('PriorityScheduling')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg shadow-md hover:bg-blue-600"
            >
              Start Simulation
            </button>
          </div>
        </div>
        {/* Footer Section with Matched Background Color */}
        <div className="bg-gray-900 py-4"></div>{" "}
        {/* Extra Space with Dark Blue Background */}
        <footer className="bg-gray-800 text-white text-center py-4">
          <p>Developed by Team: Ranjodh, Rahul, Karan,Chetan</p>
        </footer>
      </div>
    </>
  );
};

export default Docs;
