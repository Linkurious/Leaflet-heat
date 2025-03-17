# Leaflet.heat

A tiny and fast Leaflet heatmap plugin. This is a fork of the original [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) with modern improvements:

- Written in TypeScript
- ESM (ECMAScript Modules) support
- Modern build tooling with Vite
- Type definitions included
- Better tree-shaking support

## Installation

```bash
npm install @linkurious/leaflet-heat
```

## Usage

```typescript
import L from "leaflet";
import { heatLayer } from "@linkurious/leaflet-heat";

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const points = [
  [50.5, 30.5, "0.8"], // lat, lng, intensity
  [50.6, 30.4, "0.5"],
  [50.3, 30.6, "0.2"],
];

const heat = heatLayer(points).addTo(map);
```

## API

### heatLayer(points, options?)

Creates a heatmap layer given an array of points and an optional options object.

#### Points

An array of `[lat, lng, intensity]` or `[lat, lng]` arrays. The intensity should be a number between 0 and 1.

#### Options

| Option          | Type    | Default | Description                                                        |
| --------------- | ------- | ------- | ------------------------------------------------------------------ |
| radius          | number  | 25      | The radius of each "point" of the heatmap.                         |
| blur            | number  | 15      | The amount of blur.                                                |
| maxZoom         | number  | 10      | The maximum zoom level up to which the heatmap should be rendered. |
| max             | number  | 1.0     | The maximum intensity of the heatmap.                              |
| gradient        | object  | null    | Color gradient config.                                             |
| minOpacity      | number  | 0.05    | The minimum opacity the heat will start at.                        |
| useLocalExtrema | boolean | false   | Whether to use the local extremes of the data.                     |

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build

# Run the demo in development mode
npm run demo:dev

# Build the demo
npm run demo:build

# Preview the built demo
npm run demo:preview
```

## License

This project is dual-licensed:

1. The original Leaflet.heat code (up to version 0.2.0) is licensed under the [MIT License](https://github.com/Leaflet/Leaflet.heat/blob/master/LICENSE).
2. All changes and improvements made by Linkurious are licensed under the [Apache 2.0 License](LICENSE).

These licenses are compatible with each other, and you can use this software under either license. The Apache 2.0 License provides additional patent protection compared to the MIT License.

## Demos

- [10,000 points &rarr;](http://linkurious.github.io/Leaflet-heat/)
- [Adding points dynamically &rarr;](http://linkurious.github.io/Leaflet-heat/draw.html)

## Basic Usage

```js
var heat = L.heatLayer([
	[50.5, 30.5, 0.2], // lat, lng, intensity
	[50.6, 30.4, 0.5],
	...
], {radius: 25}).addTo(map);
```

To include the plugin, just use `leaflet-heat.js` from the `dist` folder:

```html
<script src="leaflet-heat.js"></script>
```

## Building

To build the dist files run:
`npm install && npm run prepublish`

## Reference

#### L.heatLayer(latlngs, options)

Constructs a heatmap layer given an array of points and an object with the following options:

- **minOpacity** - the minimum opacity the heat will start at
- **maxZoom** - zoom level where the points reach maximum intensity (as intensity scales with zoom),
  equals `maxZoom` of the map by default
- **max** - maximum point intensity, `1.0` by default
- **radius** - radius of each "point" of the heatmap, `25` by default
- **blur** - amount of blur, `15` by default
- **gradient** - color gradient config, e.g. `{0.4: 'blue', 0.65: 'lime', 1: 'red'}`
- **pane** - Map pane where the heat will be drawn. Defaults to 'overlayPane'.

Each point in the input array can be either an array like `[50.5, 30.5, 0.5]`,
or a [Leaflet LatLng object](http://leafletjs.com/reference.html#latlng).

Optional third argument in each `LatLng` point (`altitude`) represents point intensity.
Unless `max` option is specified, intensity should range between `0.0` and `1.0`.

#### Methods

- **setOptions(options)**: Sets new heatmap options and redraws it.
- **addLatLng(latlng)**: Adds a new point to the heatmap and redraws it.
- **setLatLngs(latlngs)**: Resets heatmap data and redraws it.
- **redraw()**: Redraws the heatmap.

## Changelog

### 0.2.0 &mdash; Oct 26, 2015

- Fixed intensity to work properly with `max` option.
- Fixed zoom animation on Leaflet 1.0 beta 2.
- Fixed tiles and point intensity in demos.

#### 0.1.3 &mdash; Nov 25, 2015

- Fixed some edge cases when handling point intensity.
- Added `minOpacity` option.

#### 0.1.2 &mdash; Nov 5, 2014

- Added compatibility with Leaflet 0.8-dev.

#### 0.1.1 &mdash; Apr 22, 2014

- Fixed overlaying two heatmaps on top of each other.
- Fixed rare animation issues.

#### 0.1.0 &mdash; Feb 3, 2014

- Added `addLatLng`, `setLatlngs`, `setOptions` and `redraw` methods.
- Added `max` option and support for different point intensity values (through `LatLng` third argument).
- Added `gradient` option to customize colors.

#### 0.0.1 &mdash; Jan 31, 2014

- Initial release.
