import { useCallback, useRef, useState } from 'react';

export function useStateRef<T>(initialValue: T): [React.MutableRefObject<T>, (value: T) => void] {
  const [state, _setState] = useState(initialValue);
  const stateRef = useRef(state);

  const setState = useCallback((value: T) => {
    stateRef.current = value;
    _setState(value);
  }, []);

  return [stateRef, setState];
}
