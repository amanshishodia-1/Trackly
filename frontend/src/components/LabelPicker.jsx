import { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';

const LABEL_COLORS = [
  { name: 'red', bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
  { name: 'orange', bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
  { name: 'yellow', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
  { name: 'green', bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400' },
  { name: 'blue', bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
  { name: 'purple', bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
  { name: 'pink', bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400' },
  { name: 'gray', bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-gray-400' },
];

const getLabelColor = (label) => {
  // Simple hash to assign consistent colors
  const hash = label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return LABEL_COLORS[hash % LABEL_COLORS.length];
};

const LabelPicker = ({ labels, onChange, availableLabels = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const addLabel = (label) => {
    if (label && !labels.includes(label)) {
      onChange([...labels, label]);
    }
    setNewLabel('');
    setIsOpen(false);
  };

  const removeLabel = (label) => {
    onChange(labels.filter(l => l !== label));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLabel(newLabel.trim());
    }
  };

  const uniqueAvailableLabels = [...new Set([...availableLabels, ...labels])];

  return (
    <div className="relative">
      {/* Selected Labels */}
      <div className="flex flex-wrap items-center gap-2">
        {labels.map(label => {
          const color = getLabelColor(label);
          return (
            <span
              key={label}
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${color.bg} ${color.border} ${color.text}`}
            >
              <Tag className="w-3 h-3" />
              {label}
              <button
                type="button"
                onClick={() => removeLabel(label)}
                className="hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}

        {/* Add Label Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded-full border border-dashed border-gray-500/50 text-gray-400 hover:text-gray-300 hover:border-gray-400 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add label
        </button>
      </div>

      {/* Label Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-[#0F1115] border border-[#1F2328] rounded-lg shadow-xl z-50 p-3">
            {/* New Label Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="New label..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-[#161922] border border-[#1F2328] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                autoFocus
              />
              <button
                type="button"
                onClick={() => addLabel(newLabel.trim())}
                disabled={!newLabel.trim()}
                className="p-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Existing Labels */}
            {uniqueAvailableLabels.length > 0 && (
              <>
                <div className="text-xs text-gray-500 mb-2">Existing labels</div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {uniqueAvailableLabels
                    .filter(label => !labels.includes(label))
                    .map(label => {
                      const color = getLabelColor(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => addLabel(label)}
                          className={`px-2 py-1 text-xs rounded-full border transition-colors hover:opacity-80 ${color.bg} ${color.border} ${color.text}`}
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {label}
                        </button>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LabelPicker;
export { getLabelColor, LABEL_COLORS };
