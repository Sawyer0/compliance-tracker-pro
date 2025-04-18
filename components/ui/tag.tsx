import * as React from "react";
import { cn } from "@/lib/utils";

export type TagColor = "blue" | "red" | "green" | "amber" | "purple";

const TAG_COLORS = {
  blue: {
    default: "bg-blue-100 text-blue-800",
    hover: "hover:bg-blue-200",
    selected: "bg-blue-500 text-white",
  },
  red: {
    default: "bg-red-100 text-red-800",
    hover: "hover:bg-red-200",
    selected: "bg-red-500 text-white",
  },
  green: {
    default: "bg-green-100 text-green-800",
    hover: "hover:bg-green-200",
    selected: "bg-green-500 text-white",
  },
  amber: {
    default: "bg-amber-100 text-amber-800",
    hover: "hover:bg-amber-200",
    selected: "bg-amber-500 text-white",
  },
  purple: {
    default: "bg-purple-100 text-purple-800",
    hover: "hover:bg-purple-200",
    selected: "bg-purple-500 text-white",
  },
};

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  color?: TagColor;
  selected?: boolean;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export function Tag({
  color = "blue",
  selected = false,
  label,
  onSelect,
  disabled = false,
  className,
  ...props
}: TagProps) {
  const colorClasses = selected
    ? TAG_COLORS[color].selected
    : cn(TAG_COLORS[color].default, onSelect && TAG_COLORS[color].hover);

  return (
    <div
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150",
        colorClasses,
        onSelect && !disabled && "cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
      onClick={!disabled && onSelect ? onSelect : undefined}
      onKeyDown={
        !disabled && onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
      {...props}
    >
      {label}
    </div>
  );
}

export function TagList({
  tags,
  selectedIds = [],
  onTagSelect,
  className,
  ...props
}: {
  tags: Array<{ id: string; name: string; color?: TagColor }>;
  selectedIds?: string[];
  onTagSelect?: (id: string) => void;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          label={tag.name}
          color={tag.color || "blue"}
          selected={selectedIds.includes(tag.id)}
          onSelect={onTagSelect ? () => onTagSelect(tag.id) : undefined}
        />
      ))}
    </div>
  );
}
