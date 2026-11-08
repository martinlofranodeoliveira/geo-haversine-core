#!/usr/bin/env node
// Demo: SP-RJ distance/bearing/round-trip. --assert exits non-zero on mismatch.
import { distance, bearing, destination } from '../src/geo.mjs';

const SP = { lat: -23.5505, lon: -46.6333 };
const RJ = { lat: -22.9068, lon: -43.1729 };

let failed = 0;
const d = distance(SP, RJ);
const okD = d > 355 && d < 366;
console.log(`${okD ? 'PASS' : 'FAIL'} SP-RJ ${d.toFixed(2)} km`);
if (!okD) failed++;
const b = bearing(SP, RJ);
const back = destination(SP, b, d);
const err = distance(back, RJ);
const okB = err < 1e-6;
console.log(`${okB ? 'PASS' : 'FAIL'} bearing ${b.toFixed(2)}deg, round-trip error ${err.toExponential(1)} km`);
if (!okB) failed++;
if (process.argv.includes('--assert') && failed > 0) process.exit(1);
if (failed > 0) process.exitCode = 1;
console.log(failed === 0 ? 'demo: all cases as expected' : `demo: ${failed} mismatch(es)`);
