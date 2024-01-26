import React, { useCallback, useRef, useState } from 'react';

export interface useControllableStateOptions<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (v: T) => void;
}

export function useControllableState<T>(options: useControllableStateOptions<T>) {
  // Options ref to acces from callback
  const optionsRef = useRef<useControllableStateOptions<T>>(options);
  optionsRef.current = options;

  // Inner value state and ref
  const { value: valueProp, defaultValue } = options;
  const [_value, _setValue] = useState(defaultValue as T);
  const value = useRef(_value);
  value.current = valueProp ?? _value;

  // Inner dispatch state function
  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> = useCallback((valueOrSetter) => {
    const { value: valueProp, onChange } = optionsRef.current;
    const nextValue =
      typeof valueOrSetter === 'function' ? (valueOrSetter as (p?: T) => T)(value.current) : (valueOrSetter as T);

    if (valueProp !== undefined) {
      onChange?.(nextValue);
    } else {
      _setValue(nextValue);
    }
  }, []);

  return [value.current, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}
