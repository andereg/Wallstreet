import React from 'react';
import {Onboarding} from './components/Onboarding';
import {Dashboard} from './components/Dashboard';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Generate from "./components/Generate.tsx";

function App() {

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Onboarding />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="generate" element={<Generate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;