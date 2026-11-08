# geo-haversine-core

Haversine great-circle distance, bearing, destination and radius checks.
Zero runtime dependencies, Node >= 22.

Part of the LOFRANO TECNOLOGIA open-source lab. MIT.

```js
import { distance } from './src/geo.mjs';
distance({ lat: -23.5505, lon: -46.6333 }, { lat: -22.9068, lon: -43.1729 });
// ~360.75 km (São Paulo → Rio de Janeiro)
```

```sh
npm test          # 7 tests, node:test, no dependencies
npm run demo
```

Spherical model (WGS-84 mean radius). MIT — see `LICENSE`. [Versão em português](README.pt-BR.md).
