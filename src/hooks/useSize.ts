import { RefObject, useEffect, useState } from 'react';
import { useResizeObserver } from './useResizeObserver';

export function useSize<T extends Element>(ref: RefObject<T>) {
  const [boundingRect, setRect] = useState<DOMRect>(new DOMRect());

  useResizeObserver<T>(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  }, ref);

  return boundingRect;
}
