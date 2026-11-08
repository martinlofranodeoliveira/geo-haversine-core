# Design — geo-haversine-core

Standard haversine with `min(1, …)` on the radicand (antipodal safety);
forward azimuth for bearing; spherical destination with longitude wrap.
SP–RJ pins the scale at 360.75 km; antipodes pin the maximum; the
bearing→destination round-trip closes to 1e-6 km, proving forward and
inverse consistent.

Oracle: known city pair, antipodes, boundary-inclusive radius. Spherical
model only — no ellipsoid, no datum shifts.
