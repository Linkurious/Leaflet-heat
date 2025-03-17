import L from "leaflet";
import simpleheat from "simpleheat";

interface HeatLayerOptions {
  minOpacity?: number;
  maxZoom?: number;
  radius?: number;
  blur?: number;
  max?: number;
  gradient?: { [key: number]: string };
  pane?: string;
}

type HeatLatLngTuple = [number, number, number];
type HeatLatLng = L.LatLng | HeatLatLngTuple;

type HeatData = [number, number, number];

interface ZoomAnimEvent {
  center: L.LatLng;
  zoom: number;
}

class HeatLayer extends L.Layer {
  protected _latlngs: HeatLatLng[];
  protected _map: L.Map;
  private _canvas: HTMLCanvasElement | null = null;
  private _heat: SimpleHeat | null = null;
  private _frame: number | null = null;
  options: HeatLayerOptions = {
    pane: "overlayPane",
    minOpacity: 0.05,
    maxZoom: 18,
    radius: 25,
    blur: 15,
    max: 1.0,
  };

  constructor(latlngs: HeatLatLng[], options: HeatLayerOptions = {}) {
    super();
    this._latlngs = latlngs;
    this._map = null as unknown as L.Map; // Will be set in onAdd
    L.setOptions(this, options);
  }

  setLatLngs(latlngs: HeatLatLng[]): this {
    this._latlngs = latlngs;
    return this.redraw();
  }

  addLatLng(latlng: HeatLatLng): this {
    this._latlngs.push(latlng);
    return this.redraw();
  }

  setOptions(options: HeatLayerOptions): this {
    L.setOptions(this, options);
    if (this._heat) {
      this._updateOptions();
    }
    return this.redraw();
  }

  getBounds(): L.LatLngBounds {
    return L.latLngBounds(this._latlngs);
  }

  redraw(): this {
    if (this._heat && !this._frame && this._map && !this._map._animating) {
      this._frame = L.Util.requestAnimFrame(this._redraw, this);
    }
    return this;
  }

  getContainer() {
    return this._canvas!;
  }

  onAdd(map: L.Map): this {
    this._map = map;

    if (!this._canvas) {
      this._initCanvas();
    }

    const pane = this.options.pane ? this.getPane() : map._panes.overlayPane;
    if (pane && this._canvas) {
      pane.appendChild(this._canvas);
    }

    map.on("moveend", this._reset, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on("zoomanim", this._animateZoom, this);
    }

    this._reset();
    return this;
  }

  onRemove(map: L.Map): this {
    const pane = this.options.pane ? this.getPane() : map._panes.overlayPane;
    if (pane && this._canvas) {
      pane.removeChild(this._canvas);
    }

    map.off("moveend", this._reset, this);

    if (map.options.zoomAnimation) {
      map.off("zoomanim", this._animateZoom, this);
    }
    return this;
  }

  addTo(map: L.Map): this {
    map.addLayer(this);
    return this;
  }

  private _initCanvas(): void {
    const canvas = (this._canvas = L.DomUtil.create(
      "canvas",
      "leaflet-heatmap-layer leaflet-layer"
    ));

    const originProp = L.DomUtil.testProp([
      "transformOrigin",
      "WebkitTransformOrigin",
      "msTransformOrigin",
    ]);
    if (originProp) {
      (canvas.style as unknown as Record<string, string>)[originProp] =
        "50% 50%";
    }

    const size = this._map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;

    const animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(
      canvas,
      "leaflet-zoom-" + (animated ? "animated" : "hide")
    );

    this._heat = simpleheat(canvas);
    this._updateOptions();
  }

  private _updateOptions(): void {
    if (!this._heat) return;
    this._heat.radius(
      this.options.radius || this._heat.defaultRadius,
      this.options.blur
    );

    if (this.options.gradient) {
      this._heat.gradient(this.options.gradient);
    }
    if (this.options.max) {
      this._heat.max(this.options.max);
    }
  }

  private _reset(): void {
    if (!this._heat) return;
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas!, topLeft);

    const size = this._map.getSize();

    if (this._heat._width !== size.x) {
      this._canvas!.width = this._heat._width = size.x;
    }
    if (this._heat._height !== size.y) {
      this._canvas!.height = this._heat._height = size.y;
    }

    this._redraw();
  }

  private _redraw(): void {
    if (!this._map || !this._heat) {
      return;
    }

    const data: HeatData[] = [];
    const r = this._heat._r;
    const size = this._map.getSize();
    const bounds = new L.Bounds(L.point([-r, -r]), size.add([r, r]));

    const max = this.options.max === undefined ? 1 : this.options.max;
    const maxZoom =
      this.options.maxZoom === undefined
        ? this._map.getMaxZoom()
        : this.options.maxZoom;
    const v =
      1 / Math.pow(2, Math.max(0, Math.min(maxZoom - this._map.getZoom(), 12)));
    const cellSize = r / 2;
    const grid: Array<Array<[number, number, number] | undefined>> = [];
    const panePos = this._map._getMapPanePos();
    const offsetX = panePos.x % cellSize;
    const offsetY = panePos.y % cellSize;

    for (let i = 0, len = this._latlngs.length; i < len; i++) {
      const latlng = this._latlngs[i];
      const p = this._map.latLngToContainerPoint(latlng);
      if (bounds.contains(p)) {
        const x = Math.floor((p.x - offsetX) / cellSize) + 2;
        const y = Math.floor((p.y - offsetY) / cellSize) + 2;

        let alt: number;
        if (Array.isArray(latlng)) {
          alt = latlng[2] || 1;
        } else {
          alt = (latlng as L.LatLng).alt || 1;
        }
        const k = alt * v;

        grid[y] = grid[y] || [];
        const cell = grid[y][x];

        if (!cell) {
          grid[y][x] = [p.x, p.y, k];
        } else {
          cell[0] = (cell[0] * cell[2] + p.x * k) / (cell[2] + k);
          cell[1] = (cell[1] * cell[2] + p.y * k) / (cell[2] + k);
          cell[2] += k;
        }
      }
    }

    for (let i = 0, len = grid.length; i < len; i++) {
      if (grid[i]) {
        for (let j = 0, len2 = grid[i].length; j < len2; j++) {
          const cell = grid[i][j];
          if (cell) {
            data.push([
              Math.round(cell[0]),
              Math.round(cell[1]),
              Math.min(cell[2], max),
            ]);
          }
        }
      }
    }

    this._heat.data(data).draw(this.options.minOpacity);
    this._frame = null;
  }

  private _animateZoom(e: ZoomAnimEvent): void {
    if (!this._map || !this._canvas) return;
    const scale = this._map.getZoomScale(e.zoom);
    const offset = this._map
      ._getCenterOffset(e.center)
      .multiplyBy(-scale)
      .subtract(this._map._getMapPanePos());

    if (L.DomUtil.setTransform) {
      L.DomUtil.setTransform(this._canvas, offset, scale);
    } else {
      (this._canvas.style as unknown as Record<string, string>)[
        L.DomUtil.TRANSFORM
      ] = L.DomUtil.getTranslateString(offset) + " scale(" + scale + ")";
    }
  }
}

export function heatLayer(
  latlngs: HeatLatLng[],
  options: HeatLayerOptions = {}
): HeatLayer {
  return new HeatLayer(latlngs, options);
}

export default HeatLayer;
