import { Style } from '../Style';

export class Rectangle {
  style: Style = {};

  constructor(public x: number, public y: number, public width: number, public height: number) {}

  onClick?: (event: Event, rect: Rectangle) => void;
  onPointerDown?: (event: Event, rect: Rectangle) => void;
  onPointerUp?: (event: Event, rect: Rectangle) => void;
  onPointerMove?: (event: Event, rect: Rectangle) => void;
  onDoubleClick?: (event: Event, rect: Rectangle) => void;

  draw(context: CanvasRenderingContext2D) {
    if (this.style.fill) context.fillStyle = this.style.fill;
    if (this.style.stroke) context.strokeStyle = this.style.stroke;
    if (this.style.strokeWidth) context.lineWidth = this.style.strokeWidth;

    context.fillRect(this.x, this.y, this.width, this.height);
    if (this.style.strokeWidth) context.strokeRect(this.x, this.y, this.width, this.height);
  }
}
