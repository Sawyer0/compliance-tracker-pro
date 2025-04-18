"use client";

import { X } from "lucide-react";
import { createStyles } from "@/lib/theme";

const headerStyles = createStyles({
  container: "p-4 border-b border-gray-100",
  inner: "flex items-center justify-between",
  title: "text-xl font-bold text-gray-800",
  closeButton:
    "sm:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-all duration-150",
});

interface SidebarHeaderProps {
  onClose: () => void;
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className={headerStyles.container}>
      <div className={headerStyles.inner}>
        <h2 className={headerStyles.title}>Compliance Pro</h2>
        <div
          className={headerStyles.closeButton}
          onClick={onClose}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
