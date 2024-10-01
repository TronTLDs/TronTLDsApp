import React from 'react'
import { X } from 'lucide-react'

interface Step {
  title: string
  description: string
}

interface CustomProgressStepsProps {
  steps: Step[]
  currentStep: number
  onClose: () => void
}

const CustomProgressSteps: React.FC<CustomProgressStepsProps> = ({ steps, currentStep, onClose }) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-2xl mx-auto fredoka-font">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Progress Steps</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className={`flex ${index === currentStep ? 'opacity-100' : 'opacity-50'}`}>
            <div className="flex flex-col items-center mr-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === currentStep ? 'bg-blue-500' : 'bg-gray-700'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-full bg-gray-700 mt-2"></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomProgressSteps