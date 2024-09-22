import React, { useState, useRef } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { ClientOnly } from 'remix-utils/client-only';
import { useNavigate, useBeforeUnload } from '@remix-run/react';
import { SWOTCard } from '~/components/route/swot_card';
import { AddItemForm } from '~/components/route/add_item_form';
import { ExportButtons } from '~/components/route/export_buttons';
import type { SWOTItems } from '~/types/swot_items';


export const meta: MetaFunction = () => {
  return [
    { title: "swot" },
    { name: "description", content: "swot" },
  ];
};

const SWOTBoard: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [items, setItems] = useState<SWOTItems>({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });
  const [newItem, setNewItem] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<keyof SWOTItems | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (Object.values(items).some(array => array.length > 0)) {
          event.preventDefault();
          return "Data will be DELETED. Are you sure?";
        }
      },
      [items]
    )
  );

  const categoryTitles: Record<keyof SWOTItems, string> = {
    strengths: 'Strength',
    weaknesses: 'Weakness',
    opportunities: 'Opportunity',
    threats: 'Threat'
  };

  const addItem = () => {
    if (newItem.trim() !== '' && activeCategory) {
      setItems(prev => ({
        ...prev,
        [activeCategory]: [...prev[activeCategory], newItem.trim()]
      }));
      setNewItem('');
    }
  };

  const removeItem = (category: keyof SWOTItems, index: number) => {
    setItems(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const editItem = (category: keyof SWOTItems, index: number, newValue: string) => {
    setItems(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => i === index ? newValue : item)
    }));
  };

  const toggleCategory = (category: keyof SWOTItems) => {
    setActiveCategory(prev => prev === category ? null : category);
  };

  const exportToImage = () => {
    if (typeof window !== 'undefined' && containerRef.current) {
      setIsExporting(true);
      setTimeout(() => {
        import('html-to-image').then(htmlToImage => {
          htmlToImage.toPng(containerRef.current as HTMLElement)
            .then(function (dataUrl) {
              const link = document.createElement('a');
              link.download = `${title || 'SWOT'}.png`;
              link.href = dataUrl;
              link.click();
              setIsExporting(false);
            });
        });
      }, 100); // delay for reflection
    }
  };

  return (
    <div className="p-4">
      <div ref={containerRef}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mb-4 text-xl font-bold w-full p-2 border rounded"
        />
        <div className="grid grid-cols-2 gap-4 relative">
          {(Object.keys(items) as Array<keyof SWOTItems>).map((category) => (
            <SWOTCard
              key={category}
              category={category}
              items={items[category]}
              activeCategory={activeCategory}
              categoryTitle={categoryTitles[category]}
              onToggle={toggleCategory}
              onRemove={removeItem}
              onEdit={editItem}
              isExporting={isExporting}
            />
          ))}
        </div>
      </div>
      <AddItemForm
        newItem={newItem}
        activeCategory={activeCategory}
        categoryTitles={categoryTitles}
        onNewItemChange={setNewItem}
        onAddItem={addItem}
      />
      <ClientOnly>
        {() => (
          <ExportButtons
            onExportImage={exportToImage}
          />
        )}
      </ClientOnly>
    </div>
  );
};

export default function SWOTPage() {
  return (
    <ClientOnly>
      {() => <SWOTBoard />}
    </ClientOnly>
  );
}
