import { createContext, useContext } from 'react';
import { Renderer } from './Renderer';

export const RendererContext = createContext<Renderer>(new Renderer());

export const useRendererContext = () => {
  return useContext(RendererContext);
};
