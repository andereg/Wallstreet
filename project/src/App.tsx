import React from 'react';
import {Onboarding} from './components/Onboarding';
import {Dashboard} from './components/Dashboard';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Generate from "./components/Generate.tsx";
import { LandingPage } from './components/LandingPage.tsx';

function App() {

  return (
    <div className="min-h-screen bg-gray-100">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<LandingPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="generate" element={<Generate />} />
            <Route path="onboarding" element={<Onboarding />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;