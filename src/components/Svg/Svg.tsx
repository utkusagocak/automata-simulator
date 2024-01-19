import React, { useRef } from 'react';
import { useSize } from '../../hooks/useSize';
import { Transform2D } from '../Graph/Transform2D';
import { vec2 } from 'gl-matrix';
import { observer } from 'mobx-react-lite';

export interface SvgProps extends React.HTMLAttributes<SVGElement> {
  transform: Transform2D;
}

const Svg = observer(({ transform, ...props }: SvgProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useSize(ref);

  const w = Math.floor(rect.width);
  const h = Math.floor(rect.height);
  const x = 0; // -w / 2;
  const y = 0; // -h / 2;

  const viewBoxWH = vec2.transformMat3(vec2.create(), [w, h], transform.matrix);
  const viewBoxXY = vec2.transformMat3(vec2.create(), [x, y], transform.matrix);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', contain: 'strict' }}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={Math.floor(rect.width)}
        height={Math.floor(rect.height)}
        viewBox={`${viewBoxXY[0]}  ${viewBoxXY[1]} ${viewBoxWH[0]} ${viewBoxWH[1]}`}
        {...props}
      ></svg>
    </div>
  );
});

export default Svg;
