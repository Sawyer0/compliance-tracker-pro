"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { createStyles } from "@/lib/theme";

const headerStyles = createStyles({
  container: "mb-6",
  title: "text-2xl font-bold text-gray-800",
  description: "mt-2 text-gray-600",
});

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn(headerStyles.container, className)}>
      <h1 className={headerStyles.title}>{title}</h1>
      {description && <p className={headerStyles.description}>{description}</p>}
    </div>
  );
}
