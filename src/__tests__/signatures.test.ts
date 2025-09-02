import { map as createMap, Layer } from "leaflet";
import { describe, it, expect } from "vitest";
import HeatLayer from "../HeatLayer";

describe("Class Signatures", () => {
  describe("HeatLayer", () => {
    it("should have correct method signatures", () => {
      const layer = new HeatLayer([]);

      // Check public methods
      expect(typeof layer.redraw).toBe("function");
      expect(typeof layer.setLatLngs).toBe("function");
      expect(typeof layer.addLatLng).toBe("function");
      expect(typeof layer.setOptions).toBe("function");
      expect(typeof layer.getBounds).toBe("function");

      // Check protected methods
      const protectedMethods = ["_redraw", "_animateZoom"];

      const castLayer = layer as unknown as Record<string, unknown> & {
        _latlngs: unknown;
        _heat: unknown;
        _frame: unknown;
      };
      protectedMethods.forEach((method) => {
        expect(typeof castLayer[method]).toBe("function");
      });

      // Check private methods
      const privateMethods = ["_updateOptions"];

      privateMethods.forEach((method) => {
        expect(typeof castLayer[method]).toBe("function");
      });

      // Check properties
      expect(layer.options).toBeDefined();
      expect(castLayer._latlngs).toBeDefined();
      expect(castLayer._heat).toBeDefined();
      expect(castLayer._frame).toBeDefined();
    });

    it("should be detectable as an overlay", () => {
      const layer = new HeatLayer([]);

      const map = createMap("map");
      map.addLayer(layer);
      map.setView([0, 0], 1);

      expect(layer.getPane() === map.getPane("overlayPane")).toBe(true);
      expect(layer).toBeInstanceOf(Layer);
      expect(layer.getContainer().tagName).toBe("CANVAS");
      expect(layer.getElement().tagName).toBe("CANVAS");
    });
  });
});
