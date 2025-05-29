import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import Docs from "./pages/Docs"; 
import About from "./pages/About";
import FCFS from "./components/FCFSComponent";
import SRTN from "./components/SRTNComponent";
import SJF from "./components/SJFComponent";
import PriorityScheduling from "./components/PrioritySchedulingComponent";
import MemorySimulation from "./pages/memorysimulation";
const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Docs" element={<Docs />} />
                     <Route path="/about" element={<About />}/>
                    <Route path="/Memorysimulation" element={<MemorySimulation />} />
                    <Route path="/simulator/:algorithm" element={<Simulator />} />
                    <Route path="/fcfs" element={<FCFS />} />
                    <Route path="/srtn"element={<SRTN/>}/>
                    <Route path="/sjf"element={<SJF/>}/>
                    <Route path="/PriorityScheduling"element={<PriorityScheduling/>}/>


                </Routes>
            </div>
        </Router>
    );
};

export default App;
