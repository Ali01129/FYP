import React from "react";

export default function TabGroup({ tabs }) {
  return (
    <nav className="flex gap-4 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`text-sm font-semibold ${
            tab.isActive ? "text-white" : "text-gray-400"
          } cursor-pointer`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
