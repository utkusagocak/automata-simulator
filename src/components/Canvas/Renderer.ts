import { IsInRect } from '../../math/math';
import { Rectangle } from './Rect/Rectangle';

export class Renderer {
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;

  elements: Rectangle[] = [];

  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) this.setCanvas(canvas);
  }

  addElement(element: Rectangle) {
    this.elements.push(element);
  }

  removeElement(element: Rectangle) {
    this.elements = this.elements.filter((e) => e !== element);
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (context === null) throw new Error('2d context not initialized.');
    this.context = context;

    this.canvas.addEventListener('click', this);
    this.canvas.addEventListener('pointerdown', this);
    this.canvas.addEventListener('pointerup', this);
    this.canvas.addEventListener('pointermove', this);
  }

  clear() {
    this.context.save();
    this.context.resetTransform();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }

  draw() {
    this.clear();

    for (const element of this.elements) {
      element.draw(this.context);
    }
  }

  // Handle Events
  handleEvent(event: Event) {
    switch (event.type) {
      case 'click':
        return this.handleOnClick(event as PointerEvent);
      case 'pointerdown':
        return this.handleOnPointerDown(event as PointerEvent);
      case 'pointerup':
        return this.handleOnPointerUp(event as PointerEvent);
      case 'pointermove':
        return this.handleOnPointerMove(event as PointerEvent);
      case 'dblclick':
        return this.handleOnDoubleClick(event as PointerEvent);
      default:
        return;
    }
  }

  handleOnClick(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };

    for (const element of this.elements) {
      if (element.onClick && IsInRect(point, element)) {
        return element.onClick(event, element);
      }
    }
  }

  handleOnPointerDown(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };

    for (const element of this.elements) {
      if (element.onPointerDown && IsInRect(point, element)) {
        return element.onPointerDown(event, element);
      }
    }
  }

  handleOnPointerUp(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };

    for (const element of this.elements) {
      if (element.onPointerUp && IsInRect(point, element)) {
        return element.onPointerUp(event, element);
      }
    }
  }

  handleOnPointerMove(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };

    for (const element of this.elements) {
      if (element.onPointerMove && IsInRect(point, element)) {
        return element.onPointerMove(event, element);
      }
    }
  }

  handleOnDoubleClick(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };

    for (const element of this.elements) {
      if (element.onDoubleClick && IsInRect(point, element)) {
        return element.onDoubleClick(event, element);
      }
    }
  }
}
