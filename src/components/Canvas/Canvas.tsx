import React, { useEffect, useRef } from 'react';
import { useSize } from '../../hooks/useSize';
import { RendererContext } from './RendererContext';
import { Renderer } from './Renderer';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { observer } from 'mobx-react-lite';
import { Transform2D } from './Transform2D';

export interface CanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  transform: Transform2D;
}

const Canvas = observer(({ children, transform, ...props }: CanvasProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useSize(ref);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef(new Renderer());

  const frame = useAnimationFrame();

  useEffect(() => {
    const renderFrame = (deltaTime: number) => {
      if (rendererRef.current.canvas) {
        if (transform) {
          rendererRef.current.context.resetTransform();
          rendererRef.current.context.transform(...transform.canvasTransform);
        }
        rendererRef.current.draw();
      }
    };

    frame.set(renderFrame);
    frame.start(1000 / 24);
    return () => {
      frame.stop();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) rendererRef.current.setCanvas(canvasRef.current);
  }, [canvasRef.current]);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', contain: 'paint' }}>
      <canvas ref={canvasRef} width={Math.floor(rect.width)} height={Math.floor(rect.height)} {...props}></canvas>
      {canvasRef.current && <RendererContext.Provider value={rendererRef.current}>{children}</RendererContext.Provider>}
    </div>
  );
});

export default Canvas;
