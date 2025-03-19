import React from 'react';
import { useStore } from '../store';
import { Briefcase, Building2, GraduationCap } from 'lucide-react';

const roles = ['Developer', 'Designer', 'Product Manager', 'Marketing', 'Sales'];
const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail'];
const questions = [
  'How many years of experience do you have?',
  'What are your main interests in your field?',
  'What are your career goals?',
];

export function Onboarding() {
  const { currentStep, setStep, userProfile, setUserProfile } = useStore();

  const handleNext = () => {
    if (currentStep < 3) {
      setStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Select your role
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setUserProfile({ role });
                    handleNext();
                  }}
                  className={`p-4 rounded-lg border ${
                    userProfile.role === role
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Select your industry
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => {
                    setUserProfile({ industry });
                    handleNext();
                  }}
                  className={`p-4 rounded-lg border ${
                    userProfile.industry === industry
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Experience
            </h2>
            <select
              value={userProfile.experience}
              onChange={(e) => setUserProfile({ experience: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select years of experience</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
            <button
              onClick={handleNext}
              disabled={!userProfile.experience}
              className="w-full bg-blue-500 text-white p-2 rounded-lg disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {[0, 1, 2].map((step) => (
            <div
              key={step}
              className={`w-1/3 h-2 rounded-full ${
                step <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      {renderStep()}
    </div>
  );
}