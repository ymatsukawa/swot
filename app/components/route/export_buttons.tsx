interface ExportButtonsProps {
  onExportImage: () => void;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ onExportImage }) => (
  <div className="mt-4 flex justify-end space-x-2">
    <button onClick={onExportImage} className="flex items-center px-4 py-2 bg-green-500 text-white rounded">
      <svg className="h-4 w-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
      Save as Image
    </button>
  </div>
);
