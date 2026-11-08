// SPDX-License-Identifier: MIT
// Haversine great-circle distance, initial bearing, destination point and
// radius checks on WGS-84 mean radius. Degrees in, degrees/km out.
// No network, no I/O.

export const EARTH_KM = 6371.0088;
export const MAX_KM = 20016; // half circumference + margin

export class GeoError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'GeoError';
    this.code = code;
  }
}

const rad = (deg) => (deg * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;

/** Validate {lat, lon}; throws OUT_OF_RANGE/NOT_OBJECT/BAD_NUMBER. */
export function parsePoint(p) {
  if (!p || typeof p !== 'object') throw new GeoError('NOT_OBJECT');
  const { lat, lon } = p;
  if (typeof lat !== 'number' || typeof lon !== 'number' || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new GeoError('BAD_NUMBER');
  }
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) throw new GeoError('OUT_OF_RANGE');
  return { lat, lon };
}

/** Great-circle distance in km between two points. */
export function distance(a, b) {
  const p = parsePoint(a);
  const q = parsePoint(b);
  const dLat = rad(q.lat - p.lat);
  const dLon = rad(q.lon - p.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(p.lat)) * Math.cos(rad(q.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Initial bearing in degrees [0,360) from a to b. */
export function bearing(a, b) {
  const p = parsePoint(a);
  const q = parsePoint(b);
  const dLon = rad(q.lon - p.lon);
  const y = Math.sin(dLon) * Math.cos(rad(q.lat));
  const x = Math.cos(rad(p.lat)) * Math.sin(rad(q.lat)) - Math.sin(rad(p.lat)) * Math.cos(rad(q.lat)) * Math.cos(dLon);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** Destination from a, bearing degrees, range km. Returns {lat, lon} normalized. */
export function destination(a, bearingDeg, km) {
  const p = parsePoint(a);
  if (typeof bearingDeg !== 'number' || !Number.isFinite(bearingDeg)) throw new GeoError('BAD_BEARING');
  if (typeof km !== 'number' || !(km >= 0) || km > MAX_KM) throw new GeoError('BAD_RANGE_KM');
  const delta = km / EARTH_KM;
  const br = rad(bearingDeg);
  const lat1 = rad(p.lat);
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(delta) + Math.cos(lat1) * Math.sin(delta) * Math.cos(br));
  let lon2 = rad(p.lon) + Math.atan2(Math.sin(br) * Math.sin(delta) * Math.cos(lat1), Math.cos(delta) - Math.sin(lat1) * Math.sin(lat2));
  lon2 = ((lon2 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  return { lat: deg(lat2), lon: deg(lon2) };
}

/** True when b lies within kmRadius of a (inclusive). */
export function withinRadius(a, b, kmRadius) {
  if (typeof kmRadius !== 'number' || !(kmRadius >= 0) || kmRadius > MAX_KM) throw new GeoError('BAD_RANGE_KM');
  return distance(a, b) <= kmRadius + 1e-9;
}
