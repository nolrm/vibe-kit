import React from "react";

interface ComponentProps {
  /** Description of prop */
  prop: string;
  /** Optional callback */
  onAction?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component description
 *
 * @param props - Component props
 * @returns JSX element
 */
const Component: React.FC<ComponentProps> = ({ prop, onAction, className }) => {
  return <div className={className}>{/* Component content */}</div>;
};

export default Component;
