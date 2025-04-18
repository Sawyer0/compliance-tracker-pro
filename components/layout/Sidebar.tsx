"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

import Navigation from "./Navigation";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import MobileMenuToggle from "./MobileMenuToggle";

const sidebarStyles = {
  wrapper: cn("w-[250px] max-w-sm border-r border-gray-200", "bg-white"),
  overlay: "fixed inset-0 bg-black/20 z-30 sm:hidden",
  loading: cn(
    "flex justify-center items-center h-full",
    "text-sm",
    "text-gray-500"
  ),
};

export default function Sidebar() {
  const router = useRouter();
  const { isAdmin, isLoaded } = useUserRole();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!isLoaded) {
    return (
      <div className={sidebarStyles.wrapper}>
        <div className={sidebarStyles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <MobileMenuToggle isOpen={isOpen} onToggle={toggleSidebar} />

      {/* Sidebar */}
      <aside
        className={cn(
          sidebarStyles.wrapper,
          "fixed sm:relative inset-0 z-40",
          "transition-all duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "sm:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          <SidebarHeader onClose={toggleSidebar} />

          <Navigation onLinkClick={() => setIsOpen(false)} />

          <SidebarFooter isAdmin={isAdmin} onSignOut={handleSignOut} />
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className={sidebarStyles.overlay}
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}
