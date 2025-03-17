import L from "leaflet";

declare module "leaflet" {
  interface Map {
    _animating?: boolean;
    _panes: {
      overlayPane: HTMLElement;
    };
    _getMapPanePos(): L.Point;
    _getCenterOffset(center: L.LatLng): L.Point;
  }

  namespace DomUtil {
    const TRANSFORM: string;
    function setTransform(
      el: HTMLElement,
      offset: L.Point,
      scale: number
    ): void;
    function getTranslateString(offset: L.Point): string;
  }
}
