import { vec2, mat3 } from 'gl-matrix';

export class Transform2D {
  private _scaling: vec2 = vec2.fromValues(1, 1);
  private _translation: vec2 = vec2.fromValues(0, 0);
  private _rotation: number = 0;

  matrix: mat3 = mat3.create();

  constructor() {}

  get scaling() {
    return this._scaling;
  }

  get translation() {
    return this._translation;
  }

  get rotation() {
    return this._rotation;
  }

  set scaling(s: vec2) {
    vec2.copy(this._scaling, s);
    this.reCalculateTransform();
  }

  set translation(t: vec2) {
    vec2.copy(this._translation, t);
    this.reCalculateTransform();
  }

  set rotation(r: number) {
    this._rotation = r;
    this.reCalculateTransform();
  }

  scale(x: number, y: number) {
    this._scaling[0] += x;
    this._scaling[1] += y;
    this.reCalculateTransform();
  }

  rotate(r: number) {
    this.rotation += r;
    this.reCalculateTransform();
  }

  move(x: number, y: number) {
    this._translation[0] += x;
    this._translation[1] += y;
    this.reCalculateTransform();
  }

  zoomTo(point: vec2, zoomFactor: number) {
    const result = vec2.create();
    const offset = vec2.multiply(result, vec2.multiply(result, point, this._scaling), [
      1 - zoomFactor,
      1 - zoomFactor,
    ]);

    this._scaling[0] *= zoomFactor;
    this._scaling[1] *= zoomFactor;
    this._translation[0] += offset[0];
    this._translation[1] += offset[1];
    this.reCalculateTransform();
  }

  transformInverse(point: vec2) {
    const result = vec2.subtract(vec2.create(), point, this._translation);
    vec2.divide(result, result, this._scaling);
    return vec2.rotate(result, result, [0, 0], -1 * this._rotation);
  }

  transform(point: vec2) {
    return vec2.transformMat3(vec2.create(), point, this.matrix);
  }

  reCalculateTransform() {
    this.matrix = mat3.create();
    mat3.fromTranslation(this.matrix, this._translation);
    mat3.scale(this.matrix, this.matrix, this._scaling);
    mat3.rotate(this.matrix, this.matrix, this._rotation);
  }

  get css() {
    // matrix(a, b, c, d, tx, ty)
    return `matrix(${this.matrix[0]}, ${this.matrix[1]}, ${this.matrix[3]}, ${this.matrix[4]}, ${this.matrix[6]}, ${this.matrix[7]})`;
  }

  get canvasTransform(): [number, number, number, number, number, number] {
    return [
      this.matrix[0],
      this.matrix[1],
      this.matrix[3],
      this.matrix[4],
      this.matrix[6],
      this.matrix[7],
    ];
  }
}
