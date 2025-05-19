import React from 'react';

type ElementCategory = 'stickers' | 'shapes' | 'text' | 'images';

interface ElementTypeNavProps {
  activeCategory: ElementCategory;
  onCategoryChange: (category: string) => void;
}

const ElementTypeNav: React.FC<ElementTypeNavProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  // Navigation items with icons and labels
  const navItems = [
    { id: 'stickers', label: 'Stickers', icon: 'emoji_emotions' },
    { id: 'shapes', label: 'Shapes', icon: 'category' },
    { id: 'text', label: 'Text', icon: 'text_fields' },
    { id: 'images', label: 'Images', icon: 'image' }
  ];

  return (
    <div className="flex flex-col h-full bg-surface-50 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 shadow-md-1">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onCategoryChange(item.id)}
          className={`flex flex-col items-center justify-center py-4 px-2 transition-all duration-200
                     ${activeCategory === item.id 
                       ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-300 border-r-4 border-primary-500' 
                       : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
        >
          <span className={`material-icons text-xl mb-1 ${activeCategory === item.id ? 'text-primary-500' : ''}`}>
            {item.icon}
          </span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ElementTypeNav;
