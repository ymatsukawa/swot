import React, { useState, useRef, useEffect } from 'react';
import type { SWOTItems } from '~/types/swot_items';

interface SWOTCardProps {
  category: keyof SWOTItems;
  items: string[];
  activeCategory: keyof SWOTItems | null;
  categoryTitle: string;
  onToggle: (category: keyof SWOTItems) => void;
  onRemove: (category: keyof SWOTItems, index: number) => void;
  onEdit: (category: keyof SWOTItems, index: number, newValue: string) => void;
  isExporting: boolean;
}

export const SWOTCard: React.FC<SWOTCardProps> = ({
  category,
  items,
  activeCategory,
  categoryTitle,
  onToggle,
  onRemove,
  onEdit,
  isExporting
}) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editIndex]);

  const handleEditClick = (index: number, value: string) => {
    setEditIndex(index);
    setEditValue(value);
  };

  const handleEditSave = (index: number) => {
    if (editValue.trim() !== '') {
      onEdit(category, index, editValue.trim());
    }
    setEditIndex(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleEditSave(index);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div
      className={`cursor-pointer ${
        activeCategory === category ? 'bg-slate-100' : ''
      } ${
        isExporting ? 'bg-slate-100' : ''
      } relative z-10 p-4 border rounded`}
      onClick={() => onToggle(category)}
    >
      <div className="flex flex-row items-center justify-between mb-2">
        <span className="text-lg font-semibold">{categoryTitle}</span>
        {activeCategory === category && (
          <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg>
        )}
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex items-center justify-between p-2 rounded ${editIndex === index ? 'bg-blue-100' : 'bg-slate-50'} hover:bg-blue-50`}
            onClick={(e) => {
              e.stopPropagation();
              if (editIndex !== index) {
                handleEditClick(index, item);
              }
            }}
          >
            {editIndex === index ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleEditSave(index)}
                onKeyDown={(e) => handleKeyPress(e, index)}
                className="w-full p-1 border rounded"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <span>{item}</span>
                <button
                  className="text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(category, index);
                  }}
                >
                  <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
