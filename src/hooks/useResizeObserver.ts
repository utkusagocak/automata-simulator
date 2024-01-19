import { RefObject, useEffect, useRef } from 'react';

interface ResizeObserverCallbackParams {
  width: number;
  height: number;
}

type ResizeObserverCallback = (cb: ResizeObserverCallbackParams) => void;

export function useResizeObserver<T extends Element>(cb: ResizeObserverCallback, element: RefObject<T>) {
  const observer = useRef<ResizeObserver | null>(null);
  const current = element && element.current;

  const callback = useRef(cb);
  useEffect(() => {
    callback.current = cb;
  });

  useEffect(() => {
    if (observer && observer.current && current) {
      observer.current.unobserve(current);
    }

    observer.current = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      callback.current({ width, height } as ResizeObserverCallbackParams);
    });

    observe();

    return () => {
      if (observer && observer.current && element && current) {
        observer.current.unobserve(current);
      }
    };
  }, [current]);

  const observe = () => {
    if (element && element.current && observer.current) {
      observer.current.observe(element.current);
    }
  };
}
