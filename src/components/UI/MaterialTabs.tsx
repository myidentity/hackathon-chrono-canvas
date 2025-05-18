/**
 * MaterialTabs component for ChronoCanvas
 * 
 * This component provides Material Design styled tabs for the tools palette
 * and other areas of the application.
 */

import React, { useRef } from 'react';
import './MaterialTabs.css';

interface TabProps {
  label: string;
  value: string;
  active: boolean;
  onClick: (value: string) => void;
}

/**
 * Individual Tab component with Material Design styling
 * 
 * @param {TabProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const Tab: React.FC<TabProps> = ({ label, value, active, onClick }) => {
  const tabRef = useRef<HTMLButtonElement>(null);
  
  /**
   * Handle ripple effect on click
   * 
   * @param {React.MouseEvent<HTMLButtonElement>} e - Mouse event
   */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const button = tabRef.current;
    if (!button) return;
    
    // Create ripple element
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    // Calculate ripple position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Style the ripple
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Add ripple to button
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    // Call the onClick handler
    onClick(value);
  };
  
  return (
    <button
      ref={tabRef}
      className={`material-tab ${active ? 'active' : ''}`}
      onClick={handleClick}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
    >
      {label}
    </button>
  );
};

interface MaterialTabsProps {
  tabs: Array<{
    label: string;
    value: string;
  }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * MaterialTabs component
 * Provides Material Design styled tabs
 * 
 * @param {MaterialTabsProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const MaterialTabs: React.FC<MaterialTabsProps> = ({ 
  tabs, 
  value, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`material-tabs ${className}`} role="tablist">
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
          active={tab.value === value}
          onClick={onChange}
        />
      ))}
    </div>
  );
};

export default MaterialTabs;
