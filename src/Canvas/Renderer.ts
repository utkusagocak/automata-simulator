import { Geometry } from '../math';
import { Shape } from './Shapes';
import { Transform2D } from './Transform2D';

export type RenderingContext2D = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

export class Renderer {
  canvas!: HTMLCanvasElement;
  context!: RenderingContext2D;

  hitCanvas: OffscreenCanvas = new OffscreenCanvas(1, 1);
  hitContext: RenderingContext2D;
  hitMap: { [key: string]: Shape } = {};

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

    const hitContext = this.hitCanvas.getContext('2d', { willReadFrequently: true });
    if (hitContext === null) throw new Error('2d context not initialized.');
    this.hitContext = hitContext;
  }

  addElement(element: Shape) {
    this.elements.push(element);
    this.hitMap[element.id] = element;
  }

  removeElement(element: Shape) {
    this.elements = this.elements.filter((e) => e !== element);
    delete this.hitMap[element.id];
  }

  setCanvas(canvas: HTMLCanvasElement) {
    const isFirstTime = !this.canvas;

    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.hitCanvas.width = this.width;
    this.hitCanvas.height = this.height;

    const context = canvas.getContext('2d');
    if (context === null) throw new Error('2d context not initialized.');
    this.context = context;
    // this.context = this.hitContext;
    // this.hitContext = context;

    this.canvas.addEventListener('click', this);
    this.canvas.addEventListener('pointerdown', this);
    this.canvas.addEventListener('pointerup', this);
    this.canvas.addEventListener('pointermove', this);

    if (isFirstTime) this.fitContentToView();
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.hitCanvas.width = this.width;
      this.hitCanvas.height = this.height;
      this.draw();
    }
  }

  clear() {
    this.context.save();
    this.context.resetTransform();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();

    this.hitContext.save();
    this.hitContext.resetTransform();
    this.hitContext.clearRect(0, 0, this.hitCanvas.width, this.hitCanvas.height);
    this.hitContext.restore();
  }

  drawBoundingRect() {
    this.context.save();
    this.context.resetTransform();
    this.context.setTransform(...this.transform.canvasTransform);
    this.context.strokeRect(
      this.boundingBox.x,
      this.boundingBox.y,
      this.boundingBox.width,
      this.boundingBox.height,
    );
    this.context.restore();
  }

  draw() {
    this.clear();

    this.context.save();
    this.hitContext.save();

    if (this.transform) {
      this.context.resetTransform();
      this.context.transform(...this.transform.canvasTransform);
    }

    if (this.transform) {
      this.hitContext.resetTransform();
      this.hitContext.transform(...this.transform.canvasTransform);
    }

    this.elements.sort((a, b) => (a?.style?.zIndex ?? 0) - (b?.style?.zIndex ?? 0));
    let boundingBox = null;
    for (const element of this.elements) {
      element.draw(this);

      const rect = element.getBoundingRect(this);
      if (rect && !boundingBox) boundingBox = rect;
      else if (rect && boundingBox) boundingBox = Geometry.mergeRectangle(boundingBox, rect);
    }
    this.boundingBox = boundingBox ?? { x: 0, y: 0, width: 0, height: 0 };

    this.context.restore();
    this.hitContext.restore();
  }

  async fitContentToView(viewPort?: Geometry.Rectangle) {
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

    this.draw();

    const center = {
      x: this.boundingBox.x + this.boundingBox.width / 2,
      y: this.boundingBox.y + this.boundingBox.height / 2,
    };

    this.transform.zoomTo([center.x, center.y], scale * 0.5);

    this.draw();
  }

  // Handle Events
  currentHover: string | null = null; // Shape ID| null
  setCurrentHover(id: string | null = null) {
    this.currentHover = id;
    if (this.currentHover && this.hitMap[this.currentHover]) {
      const shape = this.hitMap[this.currentHover];
      if (shape.style.cursor) {
        this.canvas.style.cursor = shape.style.cursor;
      } else if (this.canvas.style.cursor) {
        this.canvas.style.cursor = '';
      }
    } else if (this.canvas.style.cursor) {
      this.canvas.style.cursor = '';
    }
  }

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
      case 'pointerleave':
        this.setCurrentHover();
        return;
      case 'dblclick':
        return this.handleOnDoubleClick(event as PointerEvent);
      default:
        return;
    }
  }

  handleOnClick(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };
    const pixel = this.hitContext.getImageData(point.x, point.y, 1, 1).data;
    const shapeId = Shape.idFromPixel(pixel);
    const target = this.hitMap[shapeId];

    if (target && target?.onClick) {
      return target.onClick(event, target);
    }
  }

  handleOnPointerDown(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };
    const pixel = this.hitContext.getImageData(point.x, point.y, 1, 1).data;
    const shapeId = Shape.idFromPixel(pixel);
    const target = this.hitMap[shapeId];

    if (target && target?.onPointerDown) {
      return target.onPointerDown(event, target);
    }
  }

  handleOnPointerUp(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };
    const pixel = this.hitContext.getImageData(point.x, point.y, 1, 1).data;
    const shapeId = Shape.idFromPixel(pixel);
    const target = this.hitMap[shapeId];

    if (target && target?.onPointerUp) {
      return target.onPointerUp(event, target);
    }
  }

  handleOnPointerMove(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };
    const pixel = this.hitContext.getImageData(point.x, point.y, 1, 1).data;
    const shapeId = Shape.idFromPixel(pixel);
    const target = this.hitMap[shapeId];

    if (target) this.setCurrentHover(target.id);
    else this.setCurrentHover();

    if (target && target?.onPointerMove) {
      return target.onPointerMove(event, target);
    }
  }

  handleOnDoubleClick(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const point = { x: event.pageX - rect.x, y: event.pageY - rect.y };
    const pixel = this.hitContext.getImageData(point.x, point.y, 1, 1).data;
    const shapeId = Shape.idFromPixel(pixel);
    const target = this.hitMap[shapeId];

    if (target && target?.onDoubleClick) {
      return target.onDoubleClick(event, target);
    }
  }

  // Position Getters
  transformScreenCoordinatesToCanvas(screen: Geometry.Point) {
    const rect = this?.canvas.getBoundingClientRect();
    const clickAreaX = screen.x - rect.x;
    const clickAreaY = screen.y - rect.y;
    const [x, y] = this.transform.transformInverse([clickAreaX, clickAreaY]);
    return { x, y };
  }
}
