import type { RefObject } from 'react';
import { useCallback } from 'react';
import { useRef, useEffect } from 'react';
import { useStateRef } from './useStateRef';

type UseDragOptions = {
  onDrag?: (event: PointerEvent) => void;
  onStartDrag?: (event: PointerEvent) => void | false;
  onDrop?: (event: PointerEvent) => void;
};

export function useDrag(ref: RefObject<HTMLElement>, options: UseDragOptions = {}) {
  const [isDragging, setIsDragging] = useStateRef<boolean>(false);

  const optionsRef = useRef<UseDragOptions>(options);
  optionsRef.current = options;

  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (isDragging.current === true) return;

    setIsDragging(true);

    const handlePointerMove = (event: PointerEvent) => {
      if (isDragging.current) {
        optionsRef.current.onDrag?.(event);
        event.preventDefault();
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      optionsRef.current.onDrop?.(event);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointermove', handlePointerMove);

      setIsDragging(false);
    };

    const result = optionsRef.current.onStartDrag?.(event);
    if (result !== false) {
      document.addEventListener('pointerup', handlePointerUp);
      document.addEventListener('pointermove', handlePointerMove);
    }
    event.preventDefault();
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (!ref) return;

    const element = ref.current;
    if (element) {
      element?.setAttribute('draggable', 'false');
      element.addEventListener('pointerdown', handlePointerDown);
      element.addEventListener('touchstart', handleTouchStart);

      return () => {
        element.removeEventListener('pointerdown', handlePointerDown);
        element.removeEventListener('touchstart', handleTouchStart);
      };
    }

    return () => {
      return;
    };
  }, [ref.current]);

  return { isDragging: isDragging.current };
}
