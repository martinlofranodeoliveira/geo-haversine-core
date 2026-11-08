import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { distance, bearing, destination, withinRadius, GeoError } from '../src/geo.mjs';

// São Paulo (-23.5505,-46.6333), Rio (-22.9068,-43.1729): ~360.8 km.
const SP = { lat: -23.5505, lon: -46.6333 };
const RJ = { lat: -22.9068, lon: -43.1729 };

describe('distance', () => {
  it('SP-RJ is about 361 km', () => {
    const d = distance(SP, RJ);
    assert.ok(d > 355 && d < 366, `got ${d}`);
  });
  it('same point is 0, antipodes ~20015 km', () => {
    assert.equal(distance(SP, SP), 0);
    const anti = distance({ lat: 0, lon: 0 }, { lat: 0, lon: 180 });
    assert.ok(Math.abs(anti - 20015.1) < 1, `got ${anti}`);
  });
  it('rejects out-of-range and non-numbers', () => {
    assert.throws(() => distance({ lat: 91, lon: 0 }, SP), (e) => e.code === 'OUT_OF_RANGE');
    assert.throws(() => distance({ lat: 'x', lon: 0 }, SP), (e) => e.code === 'BAD_NUMBER');
    assert.ok(new GeoError('X') instanceof Error);
  });
});

describe('bearing and destination', () => {
  it('SP->RJ heads east-northeast (~70deg)', () => {
    const b = bearing(SP, RJ);
    assert.ok(b > 60 && b < 80, `got ${b}`);
  });
  it('destination inverts distance within 1e-6 km', () => {
    const d = distance(SP, RJ);
    const back = destination(SP, bearing(SP, RJ), d);
    assert.ok(distance(back, RJ) < 1e-6, `got ${distance(back, RJ)}`);
  });
  it('rejects bad range and bearing', () => {
    assert.throws(() => destination(SP, 90, -1), (e) => e.code === 'BAD_RANGE_KM');
    assert.throws(() => destination(SP, NaN, 10), (e) => e.code === 'BAD_BEARING');
  });
});

describe('withinRadius', () => {
  it('includes boundary, excludes beyond', () => {
    const d = distance(SP, RJ);
    assert.equal(withinRadius(SP, RJ, d), true);
    assert.equal(withinRadius(SP, RJ, d - 0.01), false);
  });
});
