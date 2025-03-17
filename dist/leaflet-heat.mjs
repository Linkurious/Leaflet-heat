var M = Object.defineProperty;
var L = (o, h, t) => h in o ? M(o, h, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[h] = t;
var f = (o, h, t) => L(o, typeof h != "symbol" ? h + "" : h, t);
import n from "leaflet";
function D(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var P = { exports: {} };
(function(o) {
  o.exports = h;
  function h(t) {
    if (!(this instanceof h)) return new h(t);
    this._canvas = t = typeof t == "string" ? document.getElementById(t) : t, this._ctx = t.getContext("2d"), this._width = t.width, this._height = t.height, this._max = 1, this._data = [];
  }
  h.prototype = {
    defaultRadius: 25,
    defaultGradient: {
      0.4: "blue",
      0.6: "cyan",
      0.7: "lime",
      0.8: "yellow",
      1: "red"
    },
    data: function(t) {
      return this._data = t, this;
    },
    max: function(t) {
      return this._max = t, this;
    },
    add: function(t) {
      return this._data.push(t), this;
    },
    clear: function() {
      return this._data = [], this;
    },
    radius: function(t, i) {
      i = i === void 0 ? 15 : i;
      var s = this._circle = this._createCanvas(), e = s.getContext("2d"), a = this._r = t + i;
      return s.width = s.height = a * 2, e.shadowOffsetX = e.shadowOffsetY = a * 2, e.shadowBlur = i, e.shadowColor = "black", e.beginPath(), e.arc(-a, -a, t, 0, Math.PI * 2, !0), e.closePath(), e.fill(), this;
    },
    resize: function() {
      this._width = this._canvas.width, this._height = this._canvas.height;
    },
    gradient: function(t) {
      var i = this._createCanvas(), s = i.getContext("2d"), e = s.createLinearGradient(0, 0, 0, 256);
      i.width = 1, i.height = 256;
      for (var a in t)
        e.addColorStop(+a, t[a]);
      return s.fillStyle = e, s.fillRect(0, 0, 1, 256), this._grad = s.getImageData(0, 0, 1, 256).data, this;
    },
    draw: function(t) {
      this._circle || this.radius(this.defaultRadius), this._grad || this.gradient(this.defaultGradient);
      var i = this._ctx;
      i.clearRect(0, 0, this._width, this._height);
      for (var s = 0, e = this._data.length, a; s < e; s++)
        a = this._data[s], i.globalAlpha = Math.max(a[2] / this._max, t === void 0 ? 0.05 : t), i.drawImage(this._circle, a[0] - this._r, a[1] - this._r);
      var p = i.getImageData(0, 0, this._width, this._height);
      return this._colorize(p.data, this._grad), i.putImageData(p, 0, 0), this;
    },
    _colorize: function(t, i) {
      for (var s = 0, e = t.length, a; s < e; s += 4)
        a = t[s + 3] * 4, a && (t[s] = i[a], t[s + 1] = i[a + 1], t[s + 2] = i[a + 2]);
    },
    _createCanvas: function() {
      return typeof document < "u" ? document.createElement("canvas") : new this._canvas.constructor();
    }
  };
})(P);
var Z = P.exports;
const A = /* @__PURE__ */ D(Z);
class S extends n.Layer {
  constructor(t, i = {}) {
    super();
    f(this, "_latlngs");
    f(this, "_map");
    f(this, "_canvas", null);
    f(this, "_heat", null);
    f(this, "_frame", null);
    f(this, "options", {
      minOpacity: 0.05,
      maxZoom: 18,
      radius: 25,
      blur: 15,
      max: 1
    });
    this._latlngs = t, this._map = null, n.setOptions(this, i);
  }
  setLatLngs(t) {
    return this._latlngs = t, this.redraw();
  }
  addLatLng(t) {
    return this._latlngs.push(t), this.redraw();
  }
  setOptions(t) {
    return n.setOptions(this, t), this._heat && this._updateOptions(), this.redraw();
  }
  getBounds() {
    return n.latLngBounds(this._latlngs);
  }
  redraw() {
    return this._heat && !this._frame && this._map && !this._map._animating && (this._frame = n.Util.requestAnimFrame(this._redraw, this)), this;
  }
  onAdd(t) {
    this._map = t, this._canvas || this._initCanvas();
    const i = this.options.pane ? this.getPane() : t._panes.overlayPane;
    return i && this._canvas && i.appendChild(this._canvas), t.on("moveend", this._reset, this), t.options.zoomAnimation && n.Browser.any3d && t.on("zoomanim", this._animateZoom, this), this._reset(), this;
  }
  onRemove(t) {
    const i = this.options.pane ? this.getPane() : t._panes.overlayPane;
    return i && this._canvas && i.removeChild(this._canvas), t.off("moveend", this._reset, this), t.options.zoomAnimation && t.off("zoomanim", this._animateZoom, this), this;
  }
  addTo(t) {
    return t.addLayer(this), this;
  }
  _initCanvas() {
    const t = this._canvas = n.DomUtil.create(
      "canvas",
      "leaflet-heatmap-layer leaflet-layer"
    ), i = n.DomUtil.testProp([
      "transformOrigin",
      "WebkitTransformOrigin",
      "msTransformOrigin"
    ]);
    i && (t.style[i] = "50% 50%");
    const s = this._map.getSize();
    t.width = s.x, t.height = s.y;
    const e = this._map.options.zoomAnimation && n.Browser.any3d;
    n.DomUtil.addClass(
      t,
      "leaflet-zoom-" + (e ? "animated" : "hide")
    ), this._heat = A(t), this._updateOptions();
  }
  _updateOptions() {
    this._heat && (this._heat.radius(
      this.options.radius || this._heat.defaultRadius,
      this.options.blur
    ), this.options.gradient && this._heat.gradient(this.options.gradient), this.options.max && this._heat.max(this.options.max));
  }
  _reset() {
    if (!this._heat) return;
    const t = this._map.containerPointToLayerPoint([0, 0]);
    n.DomUtil.setPosition(this._canvas, t);
    const i = this._map.getSize();
    this._heat._width !== i.x && (this._canvas.width = this._heat._width = i.x), this._heat._height !== i.y && (this._canvas.height = this._heat._height = i.y), this._redraw();
  }
  _redraw() {
    if (!this._map || !this._heat)
      return;
    const t = [], i = this._heat._r, s = this._map.getSize(), e = new n.Bounds(n.point([-i, -i]), s.add([i, i])), a = this.options.max === void 0 ? 1 : this.options.max, p = this.options.maxZoom === void 0 ? this._map.getMaxZoom() : this.options.maxZoom, z = 1 / Math.pow(2, Math.max(0, Math.min(p - this._map.getZoom(), 12))), g = i / 2, d = [], x = this._map._getMapPanePos(), C = x.x % g, O = x.y % g;
    for (let l = 0, w = this._latlngs.length; l < w; l++) {
      const c = this._latlngs[l], _ = this._map.latLngToContainerPoint(c);
      if (e.contains(_)) {
        const m = Math.floor((_.x - C) / g) + 2, v = Math.floor((_.y - O) / g) + 2;
        let y;
        Array.isArray(c) ? y = c[2] || 1 : y = c.alt || 1;
        const u = y * z;
        d[v] = d[v] || [];
        const r = d[v][m];
        r ? (r[0] = (r[0] * r[2] + _.x * u) / (r[2] + u), r[1] = (r[1] * r[2] + _.y * u) / (r[2] + u), r[2] += u) : d[v][m] = [_.x, _.y, u];
      }
    }
    for (let l = 0, w = d.length; l < w; l++)
      if (d[l])
        for (let c = 0, _ = d[l].length; c < _; c++) {
          const m = d[l][c];
          m && t.push([
            Math.round(m[0]),
            Math.round(m[1]),
            Math.min(m[2], a)
          ]);
        }
    this._heat.data(t).draw(this.options.minOpacity), this._frame = null;
  }
  _animateZoom(t) {
    if (!this._map || !this._canvas) return;
    const i = this._map.getZoomScale(t.zoom), s = this._map._getCenterOffset(t.center).multiplyBy(-i).subtract(this._map._getMapPanePos());
    n.DomUtil.setTransform ? n.DomUtil.setTransform(this._canvas, s, i) : this._canvas.style[n.DomUtil.TRANSFORM] = n.DomUtil.getTranslateString(s) + " scale(" + i + ")";
  }
}
function B(o, h = {}) {
  return new S(o, h);
}
export {
  S as default,
  B as heatLayer
};
