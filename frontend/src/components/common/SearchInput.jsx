import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

function SearchInput({ value, onChange }) {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (inputValue === value) return;

    const timer = setTimeout(() => {
      onChange(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, value, onChange]);

  return (
    <div className="relative flex items-center">
      <Search size={16} className="absolute left-3 text-gray-400" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Buscar artículos..."
        className="w-full pl-9 pr-8 py-2 rounded-full bg-gray-100 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      {inputValue && (
        <button
          onClick={() => setInputValue('')}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
