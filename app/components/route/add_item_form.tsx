import { SWOTItems } from "~/types/swot_items";

interface AddItemFormProps {
  newItem: string;
  activeCategory: keyof SWOTItems | null;
  categoryTitles: Record<keyof SWOTItems, string>;
  onNewItemChange: (value: string) => void;
  onAddItem: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ newItem, activeCategory, categoryTitles, onNewItemChange, onAddItem }) => (
  <div className="mt-4 flex">
    <input
      type="text"
      value={newItem}
      onChange={(e) => onNewItemChange(e.target.value)}
      placeholder={activeCategory ? `Add new ${categoryTitles[activeCategory]}` : "Select a section"}
      className="mr-2 flex-grow p-2 border rounded"
      disabled={!activeCategory}
    />
    <button
      onClick={onAddItem}
      disabled={!activeCategory}
      className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
    >
      &nbsp;+&nbsp;
    </button>
  </div>
);
