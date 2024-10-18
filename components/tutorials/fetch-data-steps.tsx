// app/components/tutorial/fetch-data-steps.tsx

import React from 'react';

interface FetchDataStep {
  stepNumber: number;
  description: string;
}

interface FetchDataStepsProps {
  steps: FetchDataStep[];
}

const FetchDataSteps: React.FC<FetchDataStepsProps> = ({ steps }) => {
  return (
    <div className="fetch-data-steps">
      <h2 className="text-xl font-bold">Fetch Data Steps</h2>
      <ol className="list-decimal pl-5">
        {steps.map((step) => (
          <li key={step.stepNumber} className="mb-2">
            {step.description}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default FetchDataSteps;
