import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface AutoProgressBarProps {
  steps: Step[];
  onClose: () => void;
  onComplete: () => void;
}

const AutoProgressBar: React.FC<AutoProgressBarProps> = ({
  steps,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          if (currentStep < steps.length - 1) {
            setCurrentStep((prevStep) => prevStep + 1);
            setMaxReachedStep((prevMax) => Math.max(prevMax, currentStep + 1));
            return 0;
          } else {
            onComplete();
            return 100;
          }
        }
        return prevProgress + 2; // Increase by 2% every 100ms to complete in 5 seconds
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentStep, steps.length, onComplete]);

  const getStepColor = (index: number) => {
    if (index < maxReachedStep) return "bg-green-500";
    if (index === currentStep) return "bg-blue-500";
    return "bg-gray-700";
  };

  const handleStepClick = (index: number) => {
    if (index <= maxReachedStep) {
      setCurrentStep(index);
      setProgress(0);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto fredoka-font hidden lg:block">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold bg-clip-text text-white">
          Progress Steps
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
        >
          <X size={24} />
        </button>
      </div>
      <div className="mb-12 relative">
        <div className="flex justify-between mb-2 relative z-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
              onClick={() => handleStepClick(index)}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${getStepColor(
                  index
                )} 
                  transition-all duration-300 ease-in-out cursor-pointer
                  ${index <= maxReachedStep ? "border-4 border-white" : ""}`}
              >
                {index < maxReachedStep ? (
                  <CheckCircle size={28} className="text-white" />
                ) : (
                  <div className="relative w-full h-full">
                    {index === currentStep && (
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#74ff1f"
                          strokeWidth="2"
                          strokeDasharray={`${progress}, 100`}
                        />
                      </svg>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                      {index + 1}
                    </span>
                  </div>
                )}
              </div>
              {hoveredStep === index && (
                <div className="absolute mt-20 bg-gray-800 text-white p-2 rounded shadow-lg text-sm">
                  {step.title}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute top-8 left-0 w-full h-1 bg-gray-700" />
        <div
          className="absolute top-8 left-0 h-1 bg-blue-500 transition-all duration-500 ease-in-out"
          style={{ width: `${(maxReachedStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-blue-400">
          {steps[currentStep].title}
        </h3>
        <p className="text-gray-300 leading-relaxed">
          {steps[currentStep].description}
        </p>
      </div>
    </div>
  );
};

export default AutoProgressBar;
