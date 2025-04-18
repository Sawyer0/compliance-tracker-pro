"use client";

import { Menu, X } from "lucide-react";
import { createStyles } from "@/lib/theme";

const toggleStyles = createStyles({
  container: "sm:hidden fixed top-4 left-4 z-50",
  button:
    "flex items-center justify-center h-9 w-9 rounded-md bg-white/90 shadow-sm hover:bg-gray-50 cursor-pointer transition-all duration-150",
});

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenuToggle({
  isOpen,
  onToggle,
}: MobileMenuToggleProps) {
  return (
    <div className={toggleStyles.container}>
      <div
        className={toggleStyles.button}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </div>
    </div>
  );
}
