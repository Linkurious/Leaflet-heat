import L from "leaflet";
import { heatLayer } from "@src/HeatLayer";

import "leaflet/dist/leaflet.css";
import "./style.css";

const map = L.map("map").setView([-37.82109, 175.2193], 16);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Load the data
const response = await fetch(
  "https://leaflet.github.io/Leaflet.markercluster/example/realworld.388.js"
);
const text = await response.text();
const addressPoints = eval(text.replace("var addressPoints = ", ""));

const points = addressPoints.map((p) => [p[0], p[1]]);
const heat = heatLayer(points).addTo(map);

let draw = true;

map.on({
  movestart: () => {
    draw = false;
  },
  moveend: () => {
    draw = true;
  },
  mousemove: (e) => {
    if (draw) {
      heat.addLatLng(e.latlng);
    }
  },
});
