'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseCoords = useRef({ x: -100, y: -100 });
  const currentCoords = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isHidden = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseCoords.current = { x: e.clientX, y: e.clientY };
      if (isHidden.current) {
        isHidden.current = false;
        cursor.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      isHidden.current = true;
      cursor.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isHidden.current = false;
      cursor.style.opacity = '1';
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      ) {
        if (!isHovered.current) {
          isHovered.current = true;
          cursor.style.width = '24px';
          cursor.style.height = '24px';
          cursor.style.backgroundColor = 'rgba(220, 38, 38, 0.15)';
          cursor.style.boxShadow = '0 0 12px rgba(220, 38, 38, 0.3)';
        }
      } else {
        if (isHovered.current) {
          isHovered.current = false;
          cursor.style.width = '10px';
          cursor.style.height = '10px';
          cursor.style.backgroundColor = 'rgba(220, 38, 38, 0.4)';
          cursor.style.boxShadow = 'none';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    // Initial styles
    cursor.style.opacity = '0';
    cursor.style.transition = 'width 0.15s ease-out, height 0.15s ease-out, background-color 0.15s ease-out, box-shadow 0.15s ease-out';

    let animationFrameId: number;

    const updateCursor = () => {
      // Lerping for ultra smooth mouse trace
      const ease = 0.15;
      currentCoords.current.x += (mouseCoords.current.x - currentCoords.current.x) * ease;
      currentCoords.current.y += (mouseCoords.current.y - currentCoords.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentCoords.current.x}px, ${currentCoords.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-9999 rounded-full border border-red-600/80"
      style={{
        left: 0,
        top: 0,
        width: '10px',
        height: '10px',
        backgroundColor: 'rgba(220, 38, 38, 0.4)',
        willChange: 'transform',
      }}
    />
  );
}
