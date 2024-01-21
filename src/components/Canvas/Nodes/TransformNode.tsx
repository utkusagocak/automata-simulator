import { PropsWithChildren } from 'react';

import { createContext, useContext } from 'react';

export interface LocalTransform {
  scale: number;
  translation: [number, number];
  rotation: number;
}

export const TranformContext = createContext<LocalTransform | null>(null);

export const useTransformerContext = () => {
  return useContext(TranformContext);
};

export const TransformNode = ({ transform, children }: PropsWithChildren<{ transform: LocalTransform | null }>) => {
  return <TranformContext.Provider value={transform}>{children}</TranformContext.Provider>;
};
