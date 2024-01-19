import React, { useEffect, useRef } from 'react';
import { Rectangle } from './Rectangle';
import { useRendererContext } from '../RendererContext';
import { Style } from '../Style';

export interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Style;

  onClick?: (event: Event, rect: Rectangle) => void;
  onPointerDown?: (event: Event, rect: Rectangle) => void;
  onPointerUp?: (event: Event, rect: Rectangle) => void;
  onPointerMove?: (event: Event, rect: Rectangle) => void;
  onDoubleClick?: (event: Event, rect: Rectangle) => void;
}

export const Rect = ({
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
