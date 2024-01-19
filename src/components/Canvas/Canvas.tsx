import React, { useEffect, useRef } from 'react';
import { useSize } from '../../hooks/useSize';
import { RendererContext } from './RendererContext';
import { Renderer } from './Renderer';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';

export interface CanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {}

const Canvas = ({ children, ...props }: CanvasProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useSize(ref);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef(new Renderer());

  const frame = useAnimationFrame();

  useEffect(() => {
    const renderFrame = (deltaTime: number) => {
      if (rendererRef.current.canvas) rendererRef.current.draw();
      // console.log(1000 / deltaTime);
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
};

export default Canvas;
