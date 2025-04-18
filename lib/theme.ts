/**
 * Theme configuration for the compliance tracker application
 *
 * This file centralizes all design tokens used throughout the application
 * to ensure consistent styling and easier maintenance.
 */

export const theme = {
  colors: {
    brand: {
      primary: "bg-brand",
      light: "bg-brand-light",
      dark: "bg-brand-dark",
      text: "text-white",
    },

    accent: {
      blue: "bg-accent-blue text-white",
      green: "bg-accent-green text-white",
      yellow: "bg-accent-yellow text-black",
      red: "bg-accent-red text-white",
    },

    text: {
      primary: "text-neutral-text",
      secondary: "text-neutral-muted",
      light: "text-white",
    },

    background: {
      page: "bg-neutral-background",
      card: "bg-neutral-surface",
      muted: "bg-gray-50",
    },

    border: {
      light: "border-neutral-border",
      dark: "border-gray-300",
    },
  },

  spacing: {
    card: "p-6",
    section: "p-8",
    containerX: "px-4 sm:px-6 lg:px-8",
    containerY: "py-4 sm:py-6 lg:py-8",
  },

  typography: {
    // Headings
    h1: "text-3xl sm:text-4xl font-bold text-neutral-text",
    h2: "text-2xl sm:text-3xl font-semibold text-neutral-text",
    h3: "text-xl sm:text-2xl font-semibold text-neutral-text",
    h4: "text-lg sm:text-xl font-medium text-neutral-text",

    // Body text
    body: "text-base text-neutral-text",
    bodySmall: "text-sm text-neutral-text",
    muted: "text-sm text-neutral-muted",

    // Special text
    label: "text-sm font-medium text-neutral-text",
    caption: "text-xs text-neutral-muted",
  },

  layout: {
    // Container widths
    container: "w-full max-w-7xl mx-auto",
    narrow: "w-full max-w-3xl mx-auto",

    // Flexbox utilities
    row: "flex flex-row",
    col: "flex flex-col",
    center: "items-center justify-center",
    between: "items-center justify-between",
  },

  shadows: {
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
  },

  rounded: {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  },

  animation: {
    fadeIn: "animate-fadeIn",
    fadeOut: "animate-fadeOut",
    slideInTop: "animate-slideInTop",
    slideOutTop: "animate-slideOutTop",
    slideInBottom: "animate-slideInBottom",
    slideOutBottom: "animate-slideOutBottom",
    slideInLeft: "animate-slideInLeft",
    slideOutLeft: "animate-slideOutLeft",
    slideInRight: "animate-slideInRight",
    slideOutRight: "animate-slideOutRight",
  },

  transitions: {
    default: "transition-all duration-300 ease-in-out",
    fast: "transition-all duration-150 ease-in-out",
    slow: "transition-all duration-500 ease-in-out",
  },

  charts: {
    colors: [
      "#4F46E5",
      "#38BDF8",
      "#34D399",
      "#FBBF24",
      "#F87171",
      "#818CF8",
      "#A78BFA",
      "#F472B6",
    ],
    gradients: {
      blue: "from-blue-500 to-indigo-600",
      green: "from-green-500 to-emerald-600",
      red: "from-red-500 to-rose-600",
      yellow: "from-yellow-400 to-amber-500",
    },
  },
};

export const componentStyles = {
  card: {
    base: `${theme.colors.background.card} ${theme.rounded.lg} ${theme.shadows.md} ${theme.transitions.default}`,
    hover: "hover:shadow-lg hover:border-gray-300",
    interactive: "cursor-pointer transform hover:-translate-y-1",
  },

  button: {
    primary: `${theme.colors.brand.primary} ${theme.colors.brand.text} ${theme.rounded.md} px-4 py-2 font-medium ${theme.transitions.default}`,
    secondary: `bg-white text-neutral-text ${theme.rounded.md} px-4 py-2 font-medium border border-neutral-border ${theme.transitions.default}`,
    danger: `${theme.colors.accent.red} ${theme.rounded.md} px-4 py-2 font-medium ${theme.transitions.default}`,
    ghost: `bg-transparent text-neutral-text hover:bg-gray-100 ${theme.rounded.md} px-4 py-2 font-medium ${theme.transitions.default}`,
  },

  form: {
    field: "mb-4",
    label: `${theme.typography.label} block mb-1`,
    input: `w-full px-3 py-2 bg-white border border-neutral-border ${theme.rounded.md} shadow-sm ${theme.transitions.default}`,
    error: "text-red-500 text-sm mt-1",
  },

  nav: {
    link: `${theme.typography.body} ${theme.colors.text.primary} ${theme.transitions.default}`,
    activeLink: `${theme.typography.body} font-medium ${theme.colors.brand.primary} ${theme.colors.brand.text}`,
  },

  table: {
    base: "min-w-full divide-y divide-gray-200",
    header:
      "px-6 py-3 text-left text-xs font-medium text-neutral-muted uppercase tracking-wider",
    cell: "px-6 py-4 whitespace-nowrap text-sm text-neutral-text",
    row: "bg-white",
    rowAlternate: "bg-gray-50",
    rowHover: "hover:bg-gray-50",
  },

  dashboard: {
    kpiCard: `${theme.colors.background.card} ${theme.rounded.lg} ${theme.shadows.md} ${theme.spacing.card} ${theme.transitions.default}`,
    chartWrapper: `${theme.colors.background.card} ${theme.rounded.lg} ${theme.shadows.md} p-4 ${theme.transitions.default}`,
  },

  chart: {
    tooltip: `${theme.colors.background.card} ${theme.rounded.md} ${theme.shadows.md} p-2 text-sm`,
    legend: "text-sm text-neutral-muted",
    axis: "text-xs text-neutral-muted",
  },
};

/**
 * Helper function to create a style object with Tailwind classes directly
 * This helps components transition from the old theme structure
 *
 * @example
 * const styles = createStyles({
 *   container: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
 *   title: 'text-lg font-bold text-gray-800',
 * })
 */
export function createStyles<T extends Record<string, string>>(styles: T): T {
  return styles;
}

// Utility functions for theme manipulation
export const getColor = (
  colorKey: keyof typeof theme.charts.colors,
  opacity = 1
) => {
  const color = theme.charts.colors[colorKey];
  return opacity === 1
    ? color
    : `${color}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`;
};

export const getGradient = (
  gradientKey: keyof typeof theme.charts.gradients
) => {
  return theme.charts.gradients[gradientKey];
};

export default theme;
