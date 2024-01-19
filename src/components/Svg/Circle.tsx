import React from 'react';

export interface SvgCircleProps extends React.SVGAttributes<SVGCircleElement> {}

const Circle = ({ cx, cy, r, ...props }: SvgCircleProps) => {
  return <circle cx={cx} cy={cy} r={r} {...props}></circle>;
};

export default Circle;
