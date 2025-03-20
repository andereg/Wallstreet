import React from 'react';
import { useStore } from './store';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Onboarding />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;