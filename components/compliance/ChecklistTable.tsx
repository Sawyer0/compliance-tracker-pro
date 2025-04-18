import React from 'react';
import { useFilteredChecklistItems } from "@/store/checklistStore";
import ChecklistItem from "./ChecklistItem";
import { useTrackRender } from '@/lib/utils/performance';
import { FixedSizeList } from 'react-window';

export default function ChecklistTable() {
  // Track renders in development
  useTrackRender('ChecklistTable');
  
  // Use the selector that already handles filtering
  const filteredItems = useFilteredChecklistItems();

  if (filteredItems.length === 0) {
    return (
      <p className="text-muted">
        No checklist items match your current filter.
      </p>
    );
  }

  // For small lists, render normally
  if (filteredItems.length < 20) {
    return (
      <ul className="list-spacing">
        {filteredItems.map((item) => (
          <ChecklistItem key={item.id} item={item} />
        ))}
      </ul>
    );
  }
  
  // For larger lists, use virtualization
  const ItemRow = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ChecklistItem item={filteredItems[index]} />
    </div>
  );

  return (
    <div className="h-[400px] w-full">
      <FixedSizeList
        height={400}
        width="100%"
        itemCount={filteredItems.length}
        itemSize={80} 
      >
        {ItemRow}
      </FixedSizeList>
    </div>
  );
}
