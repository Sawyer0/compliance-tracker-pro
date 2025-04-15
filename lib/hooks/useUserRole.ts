"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { UserRole } from "@/types/checklist";

export function useUserRole() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [role, setRole] = useState<UserRole>("user");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const userRole = user?.publicMetadata?.role as UserRole;
      setRole(userRole || "user");
      setIsAdmin(userRole === "admin");
      setLoading(false);
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  return {
    role,
    isAdmin,
    isLoaded: isLoaded && !loading,
    isSignedIn,
  };
}
