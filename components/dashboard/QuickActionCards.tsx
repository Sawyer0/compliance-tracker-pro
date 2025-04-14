"use client";

import React from "react";
import { Building, ClipboardList, UserPlus, Settings } from "lucide-react";

const actions = [
  { icon: <Building className="h-5 w-5" />, title: "Create Department" },
  { icon: <ClipboardList className="h-5 w-5" />, title: "Create Task" },
  { icon: <UserPlus className="h-5 w-5" />, title: "Assign User" },
  { icon: <Settings className="h-5 w-5" />, title: "Manage Settings" },
];

export default function QuickActionCards() {
  return (
    <div className="action-cards">
      {actions.map(({ icon, title }) => (
        <div key={title} className="action-card">
          <div className="action-icon">{icon}</div>
          <div className="action-title">{title}</div>
        </div>
      ))}
    </div>
  );
}
