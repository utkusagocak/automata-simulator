import { useEffect, useRef } from 'react';
import { Circle, Interactable, Style } from '../Shapes';
import { useRendererContext } from '../RendererContext';
import { useTransformerContext } from './TransformNode';

export interface RCircleProps extends Interactable {
  cx: number;
  cy: number;
  r: number;
  style?: Style;
}

export const CircleNode = ({
  cx,
  cy,
  r,
  style,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onDoubleClick,
}: RCircleProps) => {
  const renderer = useRendererContext();
  const rect = useRef(new Circle(cx, cy, r));

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
    rect.current.cx = cx;
    rect.current.cy = cy;
    rect.current.r = r;

    rect.current.style = { fill: 'red', ...style };

    rect.current.onClick = onClick;
    rect.current.onPointerDown = onPointerDown;
    rect.current.onPointerMove = onPointerMove;
    rect.current.onPointerUp = onPointerUp;
    rect.current.onDoubleClick = onDoubleClick;
  }, [cx, cy, r, style, onClick, onPointerDown, onPointerMove, onPointerUp]);

  return <></>;
};
