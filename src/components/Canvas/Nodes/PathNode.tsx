import { useEffect, useRef } from 'react';
import { Interactable, Path, Style } from '../Shapes';
import { useRendererContext } from '../RendererContext';

export interface RectProps extends Interactable {
  d: string;
  style?: Style;
}

export const PathNode = ({
  d,
  style,
  onClick,
  onDoubleClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: RectProps) => {
  const renderer = useRendererContext();
  const path = useRef(new Path(d));

  useEffect(() => {
    renderer.addElement(path.current);

    return () => {
      renderer.removeElement(path.current);
    };
  }, []);

  useEffect(() => {
    path.current.d = d;
    path.current.style = { fill: 'red', ...style };

    path.current.onClick = onClick;
    path.current.onPointerDown = onPointerDown;
    path.current.onPointerMove = onPointerMove;
    path.current.onPointerUp = onPointerUp;
    path.current.onDoubleClick = onDoubleClick;
  }, [d, style, onClick, onPointerDown, onPointerMove, onPointerUp]);

  return <></>;
};
