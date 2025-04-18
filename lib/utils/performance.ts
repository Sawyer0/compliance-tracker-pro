/**
 * Utility functions for measuring and improving React component performance
 */

/**
 * Track component renders in development mode
 * Usage: Add to component: useTrackRender('ComponentName')
 */
import { useRef, useEffect } from "react";

export function useTrackRender(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      renderCount.current += 1;
      console.log(
        `[RENDER] ${componentName} rendered ${renderCount.current} times`
      );
    }
  });
}

/**
 * Utility to help with component memoization
 * @param objA First object to compare
 * @param objB Second object to compare
 * @param keys Array of keys to compare
 * @returns True if all specified keys are equal
 */
export function shallowEqual<T extends Record<string, any>>(
  objA: T,
  objB: T,
  keys: (keyof T)[]
): boolean {
  if (objA === objB) {
    return true;
  }

  if (!objA || !objB) {
    return false;
  }

  // Check each key for equality
  for (const key of keys) {
    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Create a memoization comparison function for arrays of objects
 * @param keyProp The property to use for comparison (usually 'id')
 * @returns Comparison function for React.memo()
 */
export function createArrayComparer<T extends Record<string, any>>(
  keyProp: keyof T
) {
  return function compareArrays(
    prevProps: { items: T[] },
    nextProps: { items: T[] }
  ): boolean {
    if (prevProps.items === nextProps.items) return true;
    if (prevProps.items.length !== nextProps.items.length) return false;

    return prevProps.items.every((item, index) => {
      const nextItem = nextProps.items[index];
      return item[keyProp] === nextItem[keyProp];
    });
  };
}
