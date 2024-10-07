'use client'
import Image from 'next/image'
import { useState } from 'react'

interface TabProps {
  label: string
  isActive: boolean
  onClick: () => void
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 py-2 text-sm font-medium ${
      isActive
        ? 'text-[#4caf50] border-b-2 border-[#4caf50]'
        : 'text-gray-400 hover:text-gray-200'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
)

export default function DomainDetails() {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-[#4caf50] text-2xl font-bold mb-4">TLD</h2>
          <div className="bg-[#2a3b2a] rounded-lg p-4 flex items-center space-x-4">
            <Image
              src="/placeholder.svg?height=48&width=48"
              alt="Avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="text-white font-semibold">spiderman.tron</h3>
              <p className="text-gray-300 text-sm">Domain details</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex border-b border-gray-700 mb-4">
            <Tab label="Tab 1" isActive={activeTab === 0} onClick={() => setActiveTab(0)} />
            <Tab label="Tab 2" isActive={activeTab === 1} onClick={() => setActiveTab(1)} />
            <Tab label="Tab 3" isActive={activeTab === 2} onClick={() => setActiveTab(2)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="bg-[#1c2b1c] rounded-lg aspect-square"
                aria-label={`Content area ${index + 1}`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}