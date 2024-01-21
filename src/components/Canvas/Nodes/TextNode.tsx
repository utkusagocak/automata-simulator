import { useEffect, useLayoutEffect, useRef } from 'react';
import { Interactable, Rectangle, Style, Text } from '../Shapes';
import { useRendererContext } from '../RendererContext';
import { useTransformerContext } from './TransformNode';

export interface TextProps extends Interactable {
  x: number;
  y: number;
  width: number;
  textContent: string;
  style?: Style;
}

export const TextNode = ({
  x,
  y,
  width,
  textContent,
  style,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onDoubleClick,
}: TextProps) => {
  const renderer = useRendererContext();
  const rect = useRef(new Text(x, y, width, textContent));

  useLayoutEffect(() => {
    renderer.addElement(rect.current);

    return () => {
      renderer.removeElement(rect.current);
    };
  }, []);

  const transform = useTransformerContext();
  useLayoutEffect(() => {
    rect.current.transform = transform;
  }, [transform]);

  useLayoutEffect(() => {
    rect.current.x = x;
    rect.current.y = y;
    rect.current.width = width;
    rect.current.textContent = textContent;
    rect.current.style = {
      ...rect.current.style,
      fill: 'transparent',
      font: '16px monospace',
      textAlign: 'center',
      textBaseline: 'middle',
      ...style,
    };

    rect.current.onClick = onClick;
    rect.current.onPointerDown = onPointerDown;
    rect.current.onPointerMove = onPointerMove;
    rect.current.onPointerUp = onPointerUp;
    rect.current.onDoubleClick = onDoubleClick;
  }, [x, y, width, textContent, style, onClick, onPointerDown, onPointerMove, onPointerUp]);

  return <></>;
};
