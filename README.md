# @linkurious/leaflet-heat (Leaflet.heat)

A tiny and fast heatmap layer plugin for [Leaflet](https://leafletjs.com/).

This repository is **Linkurious’ maintained fork** of the original **[Leaflet/Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)**. The goal of this fork is to keep the same plugin behavior/API while modernizing the codebase and the packaging for today’s JavaScript tooling.

## What’s different from the upstream fork source?

Compared to the original `Leaflet/Leaflet.heat`, this fork:

- is written in **TypeScript** (with bundled `.d.ts` types)
- ships **ESM** and **CommonJS/UMD-compatible** builds via the `exports` map
- uses a **Vite**-based build/test toolchain
- is published to npm as **`@linkurious/leaflet-heat`**
- is intended to be tree-shake friendly when consumed as ESM

If you need the historical 0.2.0-era sources and changelog, refer to the upstream repository.

## Installation

```bash
npm install @linkurious/leaflet-heat
```

## Usage (ESM)

```ts
import L from "leaflet";
import { heatLayer } from "@linkurious/leaflet-heat";

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const points: Array<[number, number, number?]> = [
  [50.5, 30.5, 0.8],
  [50.6, 30.4, 0.5],
  [50.3, 30.6, 0.2],
];

heatLayer(points, { radius: 25 }).addTo(map);
```

## API

### `heatLayer(points, options?)`

Creates a heatmap layer given an array of points and an optional options object.

#### Points

An array of `[lat, lng, intensity]` or `[lat, lng]` arrays.

- `intensity` (optional) should be a number between `0` and `1`.

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

## Demos

- [10,000 points →](http://linkurious.github.io/Leaflet-heat/)
- [Adding points dynamically →](http://linkurious.github.io/Leaflet-heat/draw.html)

## Development

```bash
npm install
npm test
npm run build

# Demo
npm run demo:dev
npm run demo:build
npm run demo:preview
```

## License

This project is dual-licensed:

1. The original Leaflet.heat code (up to version 0.2.0) is licensed under the MIT License (see upstream: https://github.com/Leaflet/Leaflet.heat/blob/master/LICENSE).
2. All changes and improvements made by Linkurious are licensed under the Apache 2.0 License (see [LICENSE](LICENSE)).