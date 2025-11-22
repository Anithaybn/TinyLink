import react from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Stats from "./components/Stats";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/code/:code" element={<Stats />} />
      </Routes>
    </div>
  );
};

export default App;
