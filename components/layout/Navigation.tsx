"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LayoutDashboard, Building, Settings, Tag, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { theme, createStyles } from "@/lib/theme";
import { useState } from "react";

// Define navigation styles with direct Tailwind classes
const navStyles = createStyles({
  nav: "flex-1 p-4 overflow-y-auto space-y-4",
  navLink: "flex items-center p-2 rounded-lg gap-3 text-gray-700 transition-colors duration-150",
  navLinkActive: "bg-brand-light text-brand font-medium",
  navLinkHover: "hover:bg-gray-100",
  subNav: "pl-4 my-1 space-y-1",
  subNavLink: "flex items-center p-2 rounded-lg gap-3 text-gray-700 text-sm transition-colors duration-150",
});

interface NavigationProps {
  onLinkClick?: () => void; // Optional callback when link is clicked (for mobile)
}

export default function Navigation({ onLinkClick }: NavigationProps) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(pathname.includes('/settings'));

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
    }
  ];

  // Settings section with sub-links
  const settingsLinks = [
    {
      href: "/settings/tags",
      label: "Tags",
      icon: <Tag className="h-4 w-4" />,
    }
  ];

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <nav className={navStyles.nav}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            navStyles.navLink,
            "hover:bg-gray-100",
            isActive(link.href) && navStyles.navLinkActive
          )}
          onClick={onLinkClick}
        >
          {link.icon}
          <span>{link.label}</span>
          {isActive(link.href) && (
            <ChevronRight className="h-4 w-4 ml-auto" />
          )}
        </Link>
      ))}
      
      {/* Settings section with dropdown */}
      <div>
        <div 
          className={cn(
            navStyles.navLink,
            "hover:bg-gray-100 cursor-pointer",
            pathname.includes('/settings') && navStyles.navLinkActive
          )}
          onClick={toggleSettings}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
          <ChevronDown className={cn(
            "h-4 w-4 ml-auto transition-transform", 
            settingsOpen && "rotate-180"
          )} />
        </div>
        
        {settingsOpen && (
          <div className={navStyles.subNav}>
            {settingsLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  navStyles.subNavLink,
                  "hover:bg-gray-100",
                  isActive(link.href) && navStyles.navLinkActive
                )}
                onClick={onLinkClick}
              >
                {link.icon}
                <span>{link.label}</span>
                {isActive(link.href) && (
                  <ChevronRight className="h-3 w-3 ml-auto" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
} 