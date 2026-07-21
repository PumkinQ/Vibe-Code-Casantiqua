'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseCoords = useRef({ x: -100, y: -100 });
  const currentCoords = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isHidden = useRef(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect touch / coarse pointer devices
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    if (mediaQuery.matches || ('ontouchstart' in window && window.innerWidth < 768)) {
      setIsTouchDevice(true);
      return;
    }

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
      if (!target) return;

      const isInteractive = Boolean(
        target.closest(
          'a, button, input, textarea, select, [role="button"], .group, [data-hover], .clickable'
        )
      );

      if (isInteractive) {
        if (!isHovered.current) {
          isHovered.current = true;
          cursor.style.width = '36px';
          cursor.style.height = '36px';
          cursor.style.backgroundColor = 'rgba(220, 38, 38, 0.15)';
          cursor.style.borderColor = 'rgba(220, 38, 38, 0.8)';
          cursor.style.boxShadow = '0 0 16px rgba(220, 38, 38, 0.35)';
        }
      } else {
        if (isHovered.current) {
          isHovered.current = false;
          cursor.style.width = '12px';
          cursor.style.height = '12px';
          cursor.style.backgroundColor = 'rgba(220, 38, 38, 0.4)';
          cursor.style.borderColor = 'rgba(220, 38, 38, 0.8)';
          cursor.style.boxShadow = 'none';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    // Initial styles & transitions
    cursor.style.opacity = '0';
    cursor.style.transition =
      'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease';

    let animationFrameId: number;

    const updateCursor = () => {
      const ease = 0.18;
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

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] rounded-full border border-red-600/80 hidden md:block"
      style={{
        left: 0,
        top: 0,
        width: '12px',
        height: '12px',
        backgroundColor: 'rgba(220, 38, 38, 0.4)',
        willChange: 'transform, width, height',
      }}
    />
  );
}
