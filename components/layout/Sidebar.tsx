"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building,
  Settings,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { useClerk } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isAdmin, isLoaded } = useUserRole();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  // Handle mobile menu toggle
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Check if a link is active
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  if (!isLoaded) {
    return <div className="layout-sidebar">Loading...</div>;
  }

  // Navigation Links Array
  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/dashboard/departments",
      label: "Departments",
      icon: <Building className="h-5 w-5" />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <div
          className="flex items-center justify-center h-9 w-9 rounded-md bg-white/90 shadow-sm hover:bg-gray-50 cursor-pointer"
          onClick={toggleSidebar}
          role="button"
          tabIndex={0}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`layout-sidebar fixed sm:relative inset-0 transition-all duration-300 sm:translate-x-0 bg-white z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Compliance Pro
              </h2>
              <div
                className="sm:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={toggleSidebar}
                role="button"
                tabIndex={0}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center p-2 rounded-lg gap-3 text-gray-700 hover:bg-indigo-50 transition-colors ${
                  isActive(link.href)
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
                {isActive(link.href) && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isAdmin ? "Admin" : "User"} Account
                </p>
              </div>
              <div
                className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={handleSignOut}
                role="button"
                tabIndex={0}
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 sm:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}
