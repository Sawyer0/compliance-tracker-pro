"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

import { createStyles } from "@/lib/theme";

interface LayoutProps {
  children: React.ReactNode;
}

const layoutStyles = createStyles({
  wrapper: "flex flex-col sm:flex-row min-h-screen",
  main: "w-full flex-1 flex flex-col",
  content: "flex-1 overflow-auto p-4 sm:p-6 pt-14 sm:pt-6",
});

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={layoutStyles.wrapper}>
      <Sidebar />
      <main className={layoutStyles.main}>
        <div className={layoutStyles.content}>{children}</div>
      </main>
    </div>
  );
}
