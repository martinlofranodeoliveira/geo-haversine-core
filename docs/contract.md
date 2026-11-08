# Contract — geo-haversine-core

Pure ESM in `src/geo.mjs`, zero runtime dependencies, Node >= 22.
WGS-84 mean radius 6371.0088 km. Degrees in, degrees/km out.

| Export | Result |
| --- | --- |
| `EARTH_KM` · `MAX_KM` (20016) | Constants; ranges capped at half circumference + margin. |
| `parsePoint({lat, lon})` | Validated point. Throws `NOT_OBJECT`/`BAD_NUMBER`/`OUT_OF_RANGE`. |
| `distance(a, b)` | Great-circle km (haversine, clamped radicand). |
| `bearing(a, b)` | Initial bearing in [0,360). |
| `destination(a, bearingDeg, km)` | Point reached, longitude wrapped to [-180,180]. |
| `withinRadius(a, b, kmRadius)` | Inclusive, 1e-9 km tolerance. |

Errors: `NOT_OBJECT` · `BAD_NUMBER` · `OUT_OF_RANGE` · `BAD_BEARING` · `BAD_RANGE_KM`.
