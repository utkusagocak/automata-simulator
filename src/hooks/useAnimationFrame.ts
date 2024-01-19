import { useCallback, useRef } from 'react';

export function useAnimationFrame() {
  const requestRef = useRef<number>(0);
  const delayRef = useRef(100); // 100 ms by default

  const activeRef = useRef(false);
  const callbackRef = useRef<(deltaTime: number) => void>();
  const lastCallTimeRef = useRef(0);

  const callback = useCallback((time: number) => {
    if (time - lastCallTimeRef.current > delayRef.current) {
      callbackRef.current?.(time - lastCallTimeRef.current);
      lastCallTimeRef.current = time;
    }

    if (activeRef.current && callbackRef.current) {
      requestRef.current = requestAnimationFrame(callback);
    }
  }, []);

  const set = useCallback((callback?: (deltaTime: number) => void) => {
    cancelAnimationFrame(requestRef.current);

    callbackRef.current = callback;
  }, []);

  const start = useCallback((delay: number) => {
    delayRef.current = delay;
    activeRef.current = true;
    requestRef.current = requestAnimationFrame(callback);
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    cancelAnimationFrame(requestRef.current);
  }, []);

  return { set, start, stop };
}
