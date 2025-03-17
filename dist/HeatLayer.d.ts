import { default as L } from 'leaflet';

interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    radius?: number;
    blur?: number;
    max?: number;
    gradient?: {
        [key: number]: string;
    };
    pane?: string;
}
type HeatLatLngTuple = [number, number, number];
type HeatLatLng = L.LatLng | HeatLatLngTuple;
declare class HeatLayer extends L.Layer {
    protected _latlngs: HeatLatLng[];
    protected _map: L.Map;
    private _canvas;
    private _heat;
    private _frame;
    options: HeatLayerOptions;
    constructor(latlngs: HeatLatLng[], options?: HeatLayerOptions);
    setLatLngs(latlngs: HeatLatLng[]): this;
    addLatLng(latlng: HeatLatLng): this;
    setOptions(options: HeatLayerOptions): this;
    getBounds(): L.LatLngBounds;
    redraw(): this;
    onAdd(map: L.Map): this;
    onRemove(map: L.Map): this;
    addTo(map: L.Map): this;
    private _initCanvas;
    private _updateOptions;
    private _reset;
    private _redraw;
    private _animateZoom;
}
export declare function heatLayer(latlngs: HeatLatLng[], options?: HeatLayerOptions): HeatLayer;
export default HeatLayer;
