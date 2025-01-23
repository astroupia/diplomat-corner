"use client"; // Add this directive to ensure client-side execution

import { Circle, CheckCircle } from "lucide-react"; // Import Circle and CheckCircle (swosh)
import { useState } from "react";

const EssentialsChecklist = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const essentials = [
    "WiFi",
    "Furnished",
    "Play Ground",
    "Living Area",
    "GYM",
    "Outdoor",
    "Dining Area",
    "Jacuzzi",
    "Steam",
  ];

  const toggleSelection = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold text-secondary mb-4">Essentials</p>
      <div className="grid grid-cols-3 gap-4">
        {essentials.map((item) => (
          <button
            key={item}
            onClick={() => toggleSelection(item)}
            className={`flex items-center px-4 py-2 rounded-full shadow-md text-sm font-semibold ${
              selected.includes(item)
                ? "bg-primary text-white border border-primary"
                : "bg-white text-secondary border border-secondary"
            }`}
          >
            {/* Conditional rendering for Circle and CheckCircle */}
            {selected.includes(item) ? (
              <CheckCircle size={16} className="mr-2" /> // Show CheckCircle (swosh) when selected
            ) : (
              <Circle size={16} className="mr-2" /> // Show Circle when not selected
            )}
            <span>{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EssentialsChecklist;
