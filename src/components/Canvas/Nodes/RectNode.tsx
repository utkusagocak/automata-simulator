import { useEffect, useRef } from 'react';
import { Interactable, Rectangle, Style } from '../Shapes';
import { useRendererContext } from '../RendererContext';
import { useTransformerContext } from './TransformNode';

export interface RectProps extends Interactable {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Style;
}

export const RectNode = ({
  x,
  y,
  width,
  height,
  style,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onDoubleClick,
}: RectProps) => {
  const renderer = useRendererContext();
  const rect = useRef(new Rectangle(x, y, width, height));

  useEffect(() => {
    renderer.addElement(rect.current);

    return () => {
      renderer.removeElement(rect.current);
    };
  }, []);

  const transform = useTransformerContext();
  useEffect(() => {
    rect.current.transform = transform;
  }, [transform]);

  useEffect(() => {
    rect.current.x = x;
    rect.current.y = y;
    rect.current.width = width;
    rect.current.height = height;
    rect.current.style = { fill: 'red', ...style };

    rect.current.onClick = onClick;
    rect.current.onPointerDown = onPointerDown;
    rect.current.onPointerMove = onPointerMove;
    rect.current.onPointerUp = onPointerUp;
    rect.current.onDoubleClick = onDoubleClick;
  }, [x, y, width, height, style, onClick, onPointerDown, onPointerMove, onPointerUp]);

  return <></>;
};
