import { Geometry } from '../math';
import { Renderer, RenderingContext2D } from './Renderer';

let count = 0;
export function getUniqueShapeId() {
  const intId = ++count;
  const color = intId.toString(16);
  return `#${'0'.repeat(6 - color.length)}${color}`;
}

export interface LocalTransform {
  scale: number;
  translation: [number, number];
  rotation: number;
}

export interface Style {
  zIndex?: number;

  fill?: string;
  stroke?: string;
  strokeWidth?: number;

  font?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  background?: string;

  pointerEvents?: 'none' | 'all';
}

export interface Interactable {
  onClick?: (event: Event, rect: Shape) => void;
  onPointerDown?: (event: Event, rect: Shape) => void;
  onPointerUp?: (event: Event, rect: Shape) => void;
  onPointerMove?: (event: Event, rect: Shape) => void;
  onDoubleClick?: (event: Event, rect: Shape) => void;
}

export abstract class Shape implements Interactable {
  id: string;
  style: Style = { zIndex: 0 };
  transform: LocalTransform | null = null;

  onClick?: (event: Event, rect: Shape) => void;
  onPointerDown?: (event: Event, rect: Shape) => void;
  onPointerUp?: (event: Event, rect: Shape) => void;
  onPointerMove?: (event: Event, rect: Shape) => void;
  onDoubleClick?: (event: Event, rect: Shape) => void;

  constructor() {
    this.id = getUniqueShapeId();
  }

  static idFromPixel(data: number[] | Uint8ClampedArray) {
    return (
      '#' +
      data[0].toString(16).padStart(2, '0') +
      data[1].toString(16).padStart(2, '0') +
      data[2].toString(16).padStart(2, '0')
    );
  }

  applyTransform(contex: RenderingContext2D) {
    if (this.transform === null) return;
    contex.translate(...this.transform.translation);
    contex.scale(this.transform.scale, this.transform.scale);
    contex.rotate(this.transform.rotation);
  }

  abstract draw(renderer: Renderer): void;
  abstract isInside(p: Geometry.Point): boolean;
}

export class Rectangle extends Shape {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;

  constructor() {
    super();
  }

  isInside(point: Geometry.Point) {
    if (
      point.x >= this.x &&
      point.x <= this.x + this.width &&
      point.y >= this.y &&
      point.y <= this.y + this.width
    ) {
      return true;
    }
    return false;
  }

  draw(renderer: Renderer) {
    const context = renderer.context;
    context.save();
    context.translate(this.x, this.y);
    this.applyTransform(context);

    if (this.style.fill) context.fillStyle = this.style.fill;
    if (this.style.stroke) context.strokeStyle = this.style.stroke;
    if (this.style.strokeWidth) context.lineWidth = this.style.strokeWidth;

    context.fillRect(0, 0, this.width, this.height);
    if (this.style.strokeWidth) context.strokeRect(this.x, this.y, this.width, this.height);
    context.restore();

    renderer.boundingBox = Geometry.mergeRectangle(renderer.boundingBox, {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    });

    if (this.style.pointerEvents === 'all') {
      const hitContext = renderer.hitContext;
      hitContext.save();
      this.applyTransform(hitContext);
      hitContext.fillStyle = this.id;
      hitContext.fillRect(0, 0, this.width, this.height);
      hitContext.restore();
    }
  }
}

export class Path extends Shape {
  public d: string = '';

  constructor() {
    super();
  }

  isInside() {
    return false;
  }

  draw(renderer: Renderer) {
    const context = renderer.context;

    context.save();

    if (this.style.fill) context.fillStyle = this.style.fill;
    if (this.style.stroke) context.strokeStyle = this.style.stroke;
    if (this.style.strokeWidth) context.lineWidth = this.style.strokeWidth;

    const path = new Path2D(this.d);
    context.fill(path);
    context.stroke(path);
    context.restore();

    if (this.style.pointerEvents === 'all') {
      const hitContext = renderer.hitContext;
      hitContext.save();
      this.applyTransform(hitContext);
      if (this.style.fill && this.style.fill !== 'transparent') {
        hitContext.fillStyle = this.id;
        hitContext.fill(path);
      }
      if (this.style.stroke) {
        hitContext.strokeStyle = this.id;
        hitContext.stroke(path);
      }
      hitContext.restore();
    }

    // TODO: calculate bounding box for path
  }
}

export class Circle extends Shape {
  public cx: number = 0;
  public cy: number = 0;
  public r: number = 0;

  constructor() {
    super();
  }

  isInside(p: Geometry.Point) {
    const distanceFromCenter = Math.hypot(this.cx - p.x, this.cy - p.y);
    return distanceFromCenter <= this.r;
  }

  draw(renderer: Renderer) {
    const context = renderer.context;

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

    renderer.boundingBox = Geometry.mergeRectangle(renderer.boundingBox, {
      x: this.cx - this.r,
      y: this.cy - this.r,
      width: this.r * 2,
      height: this.r * 2,
    });

    if (this.style.pointerEvents === 'all') {
      const hitContext = renderer.hitContext;
      hitContext.save();
      hitContext.translate(this.cx, this.cy);
      this.applyTransform(hitContext);
      hitContext.fillStyle = this.id;
      hitContext.beginPath();
      hitContext.arc(0, 0, this.r, 0, 2 * Math.PI);
      hitContext.fill();
      hitContext.closePath();
      hitContext.restore();
    }
  }
}

export class Text extends Shape {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public textContent: string = '';

  constructor() {
    super();
  }

  isInside(point: Geometry.Point) {
    if (
      point.x >= this.x &&
      point.x <= this.x + this.width &&
      point.y >= this.y &&
      point.y <= this.y + this.width
    ) {
      return true;
    }
    return false;
  }

  draw(renderer: Renderer) {
    const context = renderer.context;

    context.save();
    context.translate(this.x, this.y);
    this.applyTransform(context);

    if (this.style.fill) context.fillStyle = this.style.fill;
    if (this.style.stroke) context.strokeStyle = this.style.stroke;
    if (this.style.strokeWidth) context.lineWidth = this.style.strokeWidth;

    if (this.style.font) context.font = this.style.font;
    if (this.style.textAlign) context.textAlign = this.style.textAlign;
    if (this.style.textBaseline) context.textBaseline = this.style.textBaseline;

    const textMetrics = context.measureText(this.textContent);
    const p = {
      x: 0 - textMetrics.actualBoundingBoxLeft,
      y: 0 - textMetrics.actualBoundingBoxAscent - 1,
    };
    const p1 = {
      x: 0 + textMetrics.actualBoundingBoxRight + 1,
      y: 0 + textMetrics.actualBoundingBoxDescent + 1,
    };
    if (this.style.background) {
      context.save();
      context.fillStyle = this.style.background;
      context.fillRect(p.x, p.y, textMetrics.width, p1.y - p.y);
      context.restore();
    }

    context.fillText(this.textContent, 0, 0);
    context.restore();

    renderer.boundingBox = Geometry.mergeRectangle(renderer.boundingBox, {
      x: this.x + p.x,
      y: this.y + p.y,
      width: textMetrics.width,
      height: p1.y - p.y,
    });

    if (this.style.pointerEvents === 'all') {
      const hitContext = renderer.hitContext;
      hitContext.save();
      this.applyTransform(hitContext);
      hitContext.fillStyle = this.id;
      hitContext.fillRect(p.x, p.y, textMetrics.width, p1.y - p.y);
      hitContext.restore();
    }
  }
}
