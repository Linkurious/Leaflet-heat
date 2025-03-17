interface SimpleHeat {
  radius(r: number, blur?: number): this;
  gradient(gradient: { [key: number]: string }): this;
  max(max: number): this;
  data(data: [number, number, number][]): this;
  draw(minOpacity?: number): this;
  _width: number;
  _height: number;
  _r: number;
  defaultRadius: number;
}

declare module "simpleheat" {
  const simpleheat: (canvas: HTMLCanvasElement) => SimpleHeat;
  export default simpleheat;
}
