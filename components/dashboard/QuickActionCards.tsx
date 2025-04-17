"use client";

import React from "react";
import { Building, ClipboardList, UserPlus, Settings } from "lucide-react";

type QuickActionCardsProps = {
  variant?: "left" | "right";
};

const actionCards = [
  {
    icon: <Building className="h-5 w-5" />,
    title: "Create Department",
    description: "Add a new department to track",
    variant: "left",
  },
  {
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Create Task",
    description: "Create a new compliance task",
    variant: "left",
  },
  {
    icon: <UserPlus className="h-5 w-5" />,
    title: "Assign User",
    description: "Assign tasks to team members",
    variant: "right",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    title: "Manage Settings",
    description: "Configure application settings",
    variant: "right",
  },
];

export default function QuickActionCards({
  variant = "left",
}: QuickActionCardsProps) {
  const filteredCards = actionCards.filter((card) => card.variant === variant);

  const handleCardClick = (title: string) => {
    // TODO: Implement actual action based on card title
    // This will be replaced with navigation or modal opening logic
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {filteredCards.map((card, index) => (
        <div
          key={index}
          className="bg-white/70 backdrop-blur-sm rounded-xl border border-amber-100/50 shadow-sm hover:shadow-md transition-all cursor-pointer p-3 sm:p-4"
          onClick={() => handleCardClick(card.title)}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-100 text-amber-700 p-2.5 rounded-full flex items-center justify-center min-w-[40px]">
              {card.icon}
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 text-sm sm:text-base">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-amber-700/80 mt-1 hidden sm:block">
                {card.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
