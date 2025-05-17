/**
 * MicroInteractions component for ChronoCanvas.
 * 
 * This component provides subtle, polished micro-interactions for UI elements
 * to enhance the user experience and visual appeal.
 * 
 * @module MicroInteractions
 */

import { useState, useEffect, ReactNode } from 'react';
import { generateTransform } from '../Animation/AnimationUtils';

/**
 * Props for the ButtonEffect component
 */
interface ButtonEffectProps {
  /**
   * The children to render inside the button
   */
  children: ReactNode;
  
  /**
   * Optional class name for styling
   */
  className?: string;
  
  /**
   * Optional click handler
   */
  onClick?: (e: React.MouseEvent) => void;
  
  /**
   * The effect type
   */
  effect?: 'scale' | 'lift' | 'glow' | 'ripple';
  
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

/**
 * ButtonEffect component that adds micro-interactions to buttons
 * 
 * @param {ButtonEffectProps} props - The component props
 * @returns {JSX.Element} The rendered ButtonEffect component
 */
export function ButtonEffect({
  children,
  className,
  onClick,
  effect = 'scale',
  disabled = false,
}: ButtonEffectProps): JSX.Element {
  // State for hover and active states
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // State for ripple effect
  const [ripples, setRipples] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
  }>>([]);
  
  // Handle ripple cleanup
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples([]);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [ripples]);
  
  /**
   * Handle mouse down event
   * 
   * @param {React.MouseEvent} e - The mouse event
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    setIsActive(true);
    
    // Create ripple effect
    if (effect === 'ripple') {
      const button = e.currentTarget as HTMLButtonElement;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;
      
      setRipples([...ripples, { id: Date.now(), x, y, size }]);
    }
  };
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = () => {
    if (disabled) return;
    setIsActive(false);
  };
  
  /**
   * Handle mouse enter event
   */
  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };
  
  /**
   * Handle mouse leave event
   */
  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovered(false);
    setIsActive(false);
  };
  
  /**
   * Get styles based on effect type and state
   */
  const getEffectStyles = (): React.CSSProperties => {
    if (disabled) {
      return {
        opacity: 0.6,
        cursor: 'not-allowed',
      };
    }
    
    switch (effect) {
      case 'scale':
        return {
          transform: generateTransform({
            scale: isActive ? 0.95 : isHovered ? 1.05 : 1,
          }),
          transition: 'transform 0.2s ease-out',
        };
      
      case 'lift':
        return {
          transform: generateTransform({
            translateY: isActive ? 0 : isHovered ? -3 : 0,
          }),
          boxShadow: isActive
            ? '0 2px 4px rgba(0,0,0,0.1)'
            : isHovered
            ? '0 8px 16px rgba(0,0,0,0.1)'
            : '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
        };
      
      case 'glow':
        return {
          boxShadow: isActive
            ? '0 0 0 3px rgba(59, 130, 246, 0.3)'
            : isHovered
            ? '0 0 0 2px rgba(59, 130, 246, 0.2)'
            : 'none',
          transition: 'box-shadow 0.2s ease-out',
        };
      
      case 'ripple':
        return {
          position: 'relative',
          overflow: 'hidden',
          transition: 'background-color 0.2s ease-out',
        };
      
      default:
        return {};
    }
  };
  
  return (
    <button
      className={className}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={getEffectStyles()}
      disabled={disabled}
    >
      {children}
      
      {/* Ripple effect */}
      {effect === 'ripple' && ripples.map(ripple => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            top: ripple.y - ripple.size / 2,
            left: ripple.x - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            pointerEvents: 'none',
          }}
        />
      ))}
    </button>
  );
}

/**
 * Props for the HoverCard component
 */
interface HoverCardProps {
  /**
   * The children to render inside the card
   */
  children: ReactNode;
  
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * HoverCard component that adds subtle hover effects to cards
 * 
 * @param {HoverCardProps} props - The component props
 * @returns {JSX.Element} The rendered HoverCard component
 */
export function HoverCard({
  children,
  className,
}: HoverCardProps): JSX.Element {
  // State for hover
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  /**
   * Handle mouse enter event
   */
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  /**
   * Handle mouse leave event
   */
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 20px rgba(0, 0, 0, 0.1)'
          : '0 2px 4px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Props for the FocusHighlight component
 */
interface FocusHighlightProps {
  /**
   * The children to render inside the component
   */
  children: ReactNode;
  
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * FocusHighlight component that adds subtle focus effects to inputs
 * 
 * @param {FocusHighlightProps} props - The component props
 * @returns {JSX.Element} The rendered FocusHighlight component
 */
export function FocusHighlight({
  children,
  className,
}: FocusHighlightProps): JSX.Element {
  // State for focus
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  /**
   * Handle focus event
   */
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  /**
   * Handle blur event
   */
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  return (
    <div
      className={className}
      style={{
        position: 'relative',
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      {children}
      
      <div
        style={{
          position: 'absolute',
          inset: -3,
          borderRadius: 'inherit',
          padding: 3,
          background: 'transparent',
          transition: 'background 0.2s ease-out',
          pointerEvents: 'none',
          background: isFocused
            ? 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(236, 72, 153, 0.2))'
            : 'transparent',
          opacity: isFocused ? 1 : 0,
        }}
      />
    </div>
  );
}

/**
 * Props for the LoadingIndicator component
 */
interface LoadingIndicatorProps {
  /**
   * Whether the indicator is active
   */
  active: boolean;
  
  /**
   * The type of indicator
   */
  type?: 'spinner' | 'dots' | 'progress';
  
  /**
   * The size of the indicator
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * LoadingIndicator component that shows elegant loading states
 * 
 * @param {LoadingIndicatorProps} props - The component props
 * @returns {JSX.Element | null} The rendered LoadingIndicator component or null if not active
 */
export function LoadingIndicator({
  active,
  type = 'spinner',
  size = 'medium',
  className,
}: LoadingIndicatorProps): JSX.Element | null {
  if (!active) return null;
  
  // Determine size in pixels
  const sizeInPx = size === 'small' ? 16 : size === 'medium' ? 24 : 36;
  
  // Spinner indicator
  if (type === 'spinner') {
    return (
      <div
        className={className}
        style={{
          width: sizeInPx,
          height: sizeInPx,
          borderRadius: '50%',
          border: `2px solid rgba(59, 130, 246, 0.2)`,
          borderTopColor: 'rgba(59, 130, 246, 1)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    );
  }
  
  // Dots indicator
  if (type === 'dots') {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: sizeInPx / 4,
              height: sizeInPx / 4,
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 1)',
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    );
  }
  
  // Progress indicator
  if (type === 'progress') {
    return (
      <div
        className={className}
        style={{
          width: sizeInPx * 4,
          height: sizeInPx / 4,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderRadius: sizeInPx / 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '30%',
            height: '100%',
            backgroundColor: 'rgba(59, 130, 246, 1)',
            borderRadius: sizeInPx / 8,
            animation: 'progress 1.5s ease-in-out infinite',
          }}
        />
      </div>
    );
  }
  
  return null;
}
