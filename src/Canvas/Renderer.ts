import { Geometry } from '../math';
import { Shape } from './Shapes';
import { Transform2D } from './Transform2D';

export class Renderer {
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;

  elements: Shape[] = [];
  boundingBox: Geometry.Rectangle = { x: 0, y: 0, width: 0, height: 0 };

  transform: Transform2D = new Transform2D();

  width: number = 1;
  height: number = 1;

  get center() {
    return { x: this.width * 0.5, y: this.height * 0.5 };
  }

  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) this.setCanvas(canvas);
  }

  addElement(element: Shape) {
    this.elements.push(element);
  }

  removeElement(element: Shape) {
    this.elements = this.elements.filter((e) => e !== element);
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    const context = canvas.getContext('2d');
    if (context === null) throw new Error('2d context not initialized.');
    this.context = context;

    this.canvas.addEventListener('click', this);
    this.canvas.addEventListener('pointerdown', this);
    this.canvas.addEventListener('pointerup', this);
    this.canvas.addEventListener('pointermove', this);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.draw();
    }
  }

  clear() {
    this.context.save();
    this.context.resetTransform();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }

  draw() {
    this.clear();

    this.context.save();

    if (this.transform) {
      this.context.resetTransform();
      this.context.transform(...this.transform.canvasTransform);
    }

    this.elements.sort((a, b) => (a?.style?.zIndex ?? 0) - (b?.style?.zIndex ?? 0));
    this.boundingBox = { x: 0, y: 0, width: 0, height: 0 };
    for (const element of this.elements) {
      element.draw(this);
    }

    this.context.restore();
  }

  fitContentToView(viewPort?: Geometry.Rectangle) {
    if (!this.canvas) return 0;
    this.draw();

    if (!viewPort) viewPort = { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height };

    const drawingCenterX = (this.boundingBox.x + this.boundingBox.width) / 2;
    const drawingCenterY = (this.boundingBox.y + this.boundingBox.height) / 2;

    const scaleX = viewPort.width / (this.boundingBox.width + 20);
    const scaleY = viewPort.height / (this.boundingBox.height + 20);
    const scale = Math.min(scaleX, scaleY);

    const originX = Math.floor(viewPort.x + viewPort.width / 2) - drawingCenterX;
    const originY = Math.floor(viewPort.y + viewPort.height / 2) - drawingCenterY;

    this.transform.translation = [originX, originY];
    this.transform.scaling = [1, 1];
    this.transform.zoomTo([drawingCenterX - viewPort.x, drawingCenterY - viewPort.y], scale);
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
      if (element.onClick && element.isInside(point)) {
        return element.onClick(event, element);
      }
    }
  }

  handleOnPointerDown(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };

    for (const element of this.elements) {
      if (element.onPointerDown && element.isInside(point)) {
        return element.onPointerDown(event, element);
      }
    }
  }

  handleOnPointerUp(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };

    for (const element of this.elements) {
      if (element.onPointerUp && element.isInside(point)) {
        return element.onPointerUp(event, element);
      }
    }
  }

  handleOnPointerMove(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };

    for (const element of this.elements) {
      if (element.onPointerMove && element.isInside(point)) {
        return element.onPointerMove(event, element);
      }
    }
  }

  handleOnDoubleClick(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };

    for (const element of this.elements) {
      if (element.onDoubleClick && element.isInside(point)) {
        return element.onDoubleClick(event, element);
      }
    }
  }
}
