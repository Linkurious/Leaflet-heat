import { describe, it, expect } from "vitest";
import "./setup";
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

      protectedMethods.forEach((method) => {
        expect(typeof (layer as any)[method]).toBe("function");
      });

      // Check private methods
      const privateMethods = ["_updateOptions"];

      privateMethods.forEach((method) => {
        expect(typeof (layer as any)[method]).toBe("function");
      });

      // Check properties
      expect(layer.options).toBeDefined();
      expect((layer as any)._latlngs).toBeDefined();
      expect((layer as any)._heat).toBeDefined();
      expect((layer as any)._frame).toBeDefined();
    });
  });
});
