import { Geometry } from '../../math';
import { LocalTransform } from './Nodes/TransformNode';

export interface Style {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;

  font?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  background?: string;
}

export interface Interactable {
  onClick?: (event: Event, rect: Shape) => void;
  onPointerDown?: (event: Event, rect: Shape) => void;
  onPointerUp?: (event: Event, rect: Shape) => void;
  onPointerMove?: (event: Event, rect: Shape) => void;
  onDoubleClick?: (event: Event, rect: Shape) => void;
}

export abstract class Shape implements Interactable {
  style: Style = {};
  transform: LocalTransform | null = null;

  onClick?: (event: Event, rect: Shape) => void;
  onPointerDown?: (event: Event, rect: Shape) => void;
  onPointerUp?: (event: Event, rect: Shape) => void;
  onPointerMove?: (event: Event, rect: Shape) => void;
  onDoubleClick?: (event: Event, rect: Shape) => void;

  applyTransform(contex: CanvasRenderingContext2D) {
    if (this.transform === null) return;
    contex.translate(...this.transform.translation);
    contex.scale(this.transform.scale, this.transform.scale);
    contex.rotate(this.transform.rotation);
  }

  abstract draw(context: CanvasRenderingContext2D): void;
  abstract isInside(p: Geometry.Point): boolean;
}

export class Rectangle extends Shape {
  constructor(public x: number, public y: number, public width: number, public height: number) {
    super();
  }

  isInside(point: Geometry.Point) {
    if (point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.width) {
      return true;
    }
    return false;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.y);
    this.applyTransform(context);

    if (this.style.fill) context.fillStyle = this.style.fill;
    if (this.style.stroke) context.strokeStyle = this.style.stroke;
    if (this.style.strokeWidth) context.lineWidth = this.style.strokeWidth;

    context.fillRect(0, 0, this.width, this.height);
    if (this.style.strokeWidth) context.strokeRect(this.x, this.y, this.width, this.height);
    context.restore();
  }
}

export class Path extends Shape {
  constructor(public d: string) {
    super();
  }

  isInside() {
    return false;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();

    if (this.style.fill) context.fillStyle = this.style.fill;
    if (this.style.stroke) context.strokeStyle = this.style.stroke;
    if (this.style.strokeWidth) context.lineWidth = this.style.strokeWidth;

    const path = new Path2D(this.d);
    context.fill(path);
    context.stroke(path);
    context.restore();
  }
}

export class Circle extends Shape {
  constructor(public cx: number, public cy: number, public r: number) {
    super();
  }

  isInside(p: Geometry.Point) {
    const distanceFromCenter = Math.sqrt(Math.pow(this.cx - p.x, 2) + Math.pow(this.cy - p.y, 2));
    return distanceFromCenter <= this.r;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.cx, this.cy);
    this.applyTransform(context);

    if (this.style.fill) context.fillStyle = this.style.fill;
    if (this.style.stroke) context.strokeStyle = this.style.stroke;
    if (this.style.strokeWidth) context.lineWidth = this.style.strokeWidth;

    context.beginPath();

    context.arc(0, 0, this.r, 0, 2 * Math.PI);

    context.fill();
    context.stroke();
    context.closePath();
    context.restore();
  }
}

export class Text extends Shape {
  constructor(public x: number, public y: number, public width: number, public textContent: string) {
    super();
  }

  isInside(point: Geometry.Point) {
    if (point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.width) {
      return true;
    }
    return false;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.y);
    this.applyTransform(context);

    if (this.style.fill) context.fillStyle = this.style.fill;
    if (this.style.stroke) context.strokeStyle = this.style.stroke;
    if (this.style.strokeWidth) context.lineWidth = this.style.strokeWidth;

    if (this.style.font) context.font = this.style.font;
    if (this.style.textAlign) context.textAlign = this.style.textAlign;
    if (this.style.textBaseline) context.textBaseline = this.style.textBaseline;

    if (this.style.background) {
      context.save();
      context.fillStyle = this.style.background;
      const textMetrics = context.measureText(this.textContent);
      const p = {
        x: 0 - textMetrics.actualBoundingBoxLeft,
        y: 0 - textMetrics.actualBoundingBoxAscent - 1,
      };
      const p1 = {
        x: 0 + textMetrics.actualBoundingBoxRight + 1,
        y: 0 + textMetrics.actualBoundingBoxDescent + 1,
      };
      context.fillRect(p.x, p.y, textMetrics.width, p1.y - p.y);
      context.restore();
    }

    context.fillText(this.textContent, 0, 0);
    context.restore();
  }
}
