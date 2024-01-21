import { useEffect, useLayoutEffect, useRef } from 'react';
import { Interactable, Path, Style } from '../Shapes';
import { useRendererContext } from '../RendererContext';
import { useTransformerContext } from './TransformNode';

export interface PathNode extends Interactable {
  d: string;
  style?: Style;
}

export const PathNode = ({ d, style, onClick, onDoubleClick, onPointerDown, onPointerMove, onPointerUp }: PathNode) => {
  const renderer = useRendererContext();
  const path = useRef(new Path(d));

  useLayoutEffect(() => {
    renderer.addElement(path.current);

    return () => {
      renderer.removeElement(path.current);
    };
  }, []);

  const transform = useTransformerContext();
  useLayoutEffect(() => {
    path.current.transform = transform;
  }, [transform]);

  useLayoutEffect(() => {
    path.current.d = d;
    path.current.style = { ...path.current.style, fill: 'red', ...style };

    path.current.onClick = onClick;
    path.current.onPointerDown = onPointerDown;
    path.current.onPointerMove = onPointerMove;
    path.current.onPointerUp = onPointerUp;
    path.current.onDoubleClick = onDoubleClick;
  }, [d, style, onClick, onPointerDown, onPointerMove, onPointerUp]);

  return <></>;
};
