import React, { useRef } from 'react';
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { Link } from 'react-router-dom';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  to?: string;
  dampening?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  to,
  dampening = 0.35
}) => {
  // triggerRef covers the magnetic "field"
  // innerRef is the visual element that actually moves
  const triggerRef = useRef<any>(null);
  const innerRef = useRef<any>(null);

  const handleMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const trigger = triggerRef.current;
    const inner = innerRef.current;
    if (!trigger || !inner) return;

    const rect = trigger.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) * dampening;
    const y = (e.clientY - centerY) * dampening;

    // Apply translation to the inner visual element
    inner.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;

    inner.style.transform = 'translate(0px, 0px)';
  };

  const entranceAnimationClass = className.includes('btn-primary-mirror') 
    ? 'animate-primary' 
    : 'animate-ghost';

  const renderContent = () => {
    const contentProps = {
      ref: innerRef,
      className: `magnetic-inner ${className}`,
      style: {
        display: 'inline-block',
        transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        willChange: 'transform'
      }
    };

    if (to) {
      return (
        <Link to={to} {...contentProps}>
          {children}
        </Link>
      );
    }

    return (
      <button onClick={onClick} {...contentProps}>
        {children}
      </button>
    );
  };

  return (
    <div 
      ref={triggerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-trigger ${entranceAnimationClass}`}
      style={{
        display: 'inline-block',
        padding: '12px', // Balanced magnetic field
        pointerEvents: 'auto'
      }}
    >
      {renderContent()}
    </div>
  );
};

export default MagneticButton;
