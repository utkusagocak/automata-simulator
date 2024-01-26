import React, { useEffect, useRef } from 'react';
import { useSize } from '../../hooks/useSize';
import { RendererContext } from './RendererContext';
import { Renderer } from './Renderer';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { observer } from 'mobx-react-lite';
import { useDrag } from '../../hooks/useDrag';
import { Geometry } from '../../math';

export interface CanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  focusRectangle?: Geometry.Rectangle;
}

const Canvas = observer(({ children, focusRectangle, ...props }: CanvasProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useSize(ref);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef(new Renderer());

  const frame = useAnimationFrame();

  useEffect(() => {
    const renderFrame = (deltaTime: number) => {
      const renderer = rendererRef.current;
      if (renderer.canvas) {
        if (renderer.transform) {
          renderer.context.resetTransform();
          renderer.context.transform(...renderer.transform.canvasTransform);
        }
        renderer.draw();

        // Debug for canvas drawing bounding box

        // renderer.context.save();
        // const drawingCenterX = renderer.boundingBox.x + renderer.boundingBox.width / 2;
        // const drawingCenterY = renderer.boundingBox.y + renderer.boundingBox.height / 2;

        // renderer.context.strokeRect(
        //   renderer.boundingBox.x,
        //   renderer.boundingBox.y,
        //   renderer.boundingBox.width,
        //   renderer.boundingBox.height,
        // );

        // renderer.context.resetTransform();
        // renderer.context.transform(...renderer.transform.canvasTransform);
        // renderer.context.fillStyle = 'red';
        // renderer.context.fillRect(drawingCenterX - 2, drawingCenterY - 2, 4, 4);
        // renderer.context.restore();
      }
    };

    frame.set(renderFrame);
    frame.start(1000 / 24);
    return () => {
      frame.stop();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current && ref.current) {
      const rect1 = ref.current.getBoundingClientRect();
      canvasRef.current.width = rect1.width;
      canvasRef.current.height = rect1.height;

      rendererRef.current.setCanvas(canvasRef.current);

      setTimeout(() => {
        const renderer = rendererRef.current;

        if (renderer.canvas && focusRectangle) {
          renderer.fitContentToView(focusRectangle);
        }
      }, 100);
    }
  }, [canvasRef.current]);

  const elementRef = useRef({ x: 0, y: 0 });
  useDrag(ref, {
    onStartDrag: (e) => {
      if (ref.current) {
        const renderer = rendererRef.current;
        const rect = ref.current.getBoundingClientRect();
        const x = e.pageX - rect.x;
        const y = e.pageY - rect.y;
        elementRef.current = { x, y };
      }
    },
    onDrag: (e) => {
      if (ref.current) {
        const renderer = rendererRef.current;
        const rect = ref.current.getBoundingClientRect();
        const x = e.pageX - rect.x;
        const y = e.pageY - rect.y;
        renderer.transform.move(x - elementRef.current.x, y - elementRef.current.y);
        elementRef.current = { x, y };
      }
    },
  });

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%', contain: 'paint' }}
      onWheel={(e) => {
        const clickArea = ref.current;
        if (clickArea) {
          const renderer = rendererRef.current;

          // Screen space to canvas space
          const rect = clickArea.getBoundingClientRect();
          const clickAreaX = e.pageX - rect.x;
          const clickAreaY = e.pageY - rect.y;
          const [x, y] = renderer.transform.transformInverse([clickAreaX, clickAreaY]);

          const zoom = e.deltaY > 0 ? 0.9 : 1.1;
          if (renderer.transform.scaling[0] * zoom < 250) {
            renderer.transform.zoomTo([x, y], zoom);
          }
        }
      }}
    >
      <canvas ref={canvasRef} width={Math.floor(rect.width)} height={Math.floor(rect.height)} {...props}></canvas>
      <RendererContext.Provider value={rendererRef.current}>{children}</RendererContext.Provider>
    </div>
  );
});

export default Canvas;
