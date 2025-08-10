import { useEffect, useRef, useState } from "react";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export function Tooltip({ children, content, disabled = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const rect = tooltip.getBoundingClientRect();
      
      // Adjust position to keep tooltip within viewport
      let adjustedX = position.x;
      let adjustedY = position.y;

      if (rect.right > window.innerWidth) {
        adjustedX = window.innerWidth - rect.width - 10;
      }
      if (rect.left < 0) {
        adjustedX = 10;
      }
      if (rect.top < 0) {
        adjustedY = position.y + 40;
      }

      tooltip.style.left = adjustedX + "px";
      tooltip.style.top = (adjustedY - 10) + "px";
    }
  }, [isVisible, position.x, position.y]);

  return (
    <>
      <div
        ref={triggerRef}
        className={styles.trigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          className={styles.tooltip}
          style={{
            left: position.x,
            top: position.y - 10,
          }}
        >
          {content}
        </div>
      )}
    </>
  );
}
