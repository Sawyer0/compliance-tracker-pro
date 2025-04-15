"use client";

import React from "react";
import { Building, ClipboardList, UserPlus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {filteredCards.map((card, index) => (
        <Card
          key={index}
          className="border-0 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full h-auto flex items-center justify-start text-left p-2"
              onClick={() => console.log(`Clicked: ${card.title}`)}
            >
              <div className="flex items-start gap-3">
                <div className="action-icon">{card.icon}</div>
                <div>
                  <h3 className="action-title">{card.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
