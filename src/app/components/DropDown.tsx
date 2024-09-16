import { useState } from "react";
import "../css/Home.css"

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    "Launched Time",
    "Trading Volume",
    "Market Cap",
    "24H Price Increase",
  ];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center w-48 px-4 py-2 rounded-md shadow-sm *:focus:outline-none dropdown-container truncate"
      >
        {selectedOption || "Launched Time"}
        <svg
          className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.292 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-full shadow-lg">
          <ul className="rounded-full">
            {options.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSelect(option)}
                  title={`${option}`}
                  className={`block w-full px-4 py-2 text-center dropdown-container2 ${option === selectedOption ? "text-[#b482ff]" : "text-white"}`}
                >
                  <span className="hover:scale-110">{option}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
