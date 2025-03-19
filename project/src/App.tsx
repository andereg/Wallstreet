import React from 'react';
import { useStore } from './store';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';

function App() {
  const { currentStep } = useStore();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      {currentStep < 3 ? <Onboarding /> : <Dashboard />}
    </div>
  );
}

export default App;