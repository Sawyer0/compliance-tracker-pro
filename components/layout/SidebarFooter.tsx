"use client";

import { LogOut } from "lucide-react";
import { createStyles } from "@/lib/theme";

const footerStyles = createStyles({
  container: "p-4 border-t border-gray-100",
  wrapper: "flex items-center justify-between",
  userLabel: "text-sm font-medium text-gray-700",
  signOutButton:
    "flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 cursor-pointer transition-all duration-150",
});

interface SidebarFooterProps {
  isAdmin: boolean;
  onSignOut: () => void;
}

export default function SidebarFooter({
  isAdmin,
  onSignOut,
}: SidebarFooterProps) {
  return (
    <div className={footerStyles.container}>
      <div className={footerStyles.wrapper}>
        <div>
          <p className={footerStyles.userLabel}>
            {isAdmin ? "Admin" : "User"} Account
          </p>
        </div>
        <div
          className={footerStyles.signOutButton}
          onClick={onSignOut}
          role="button"
          tabIndex={0}
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
