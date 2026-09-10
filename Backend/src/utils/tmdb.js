import https from 'node:https';
import dns from 'node:dns';
import axios from 'axios';

// Public DNS resolvers (Google DNS, Cloudflare DNS)
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1']);

// Custom HTTPS agent to resolve hostnames via public DNS, bypassing ISP-level DNS blocks/sinkholes (e.g., Jio 49.44.x.x)
const httpsAgent = new https.Agent({
  keepAlive: true,
  lookup: (hostname, options, callback) => {
    let cb = callback;
    let opts = options;
    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    } else if (typeof opts === 'number') {
      opts = { family: opts };
    }

    resolver.resolve4(hostname, (err, addresses) => {
      if (!err && addresses && addresses.length > 0) {
        // Filter out known ISP sinkhole / block IPs (e.g., Jio 49.44.x.x)
        const validAddresses = addresses.filter((ip) => !ip.startsWith('49.44.'));
        const target = validAddresses.length > 0 ? validAddresses : addresses;

        if (opts && opts.all) {
          return cb(
            null,
            target.map((addr) => ({ address: addr, family: 4 }))
          );
        }
        return cb(null, target[0], 4);
      }

      // Fallback to default system DNS lookup
      dns.lookup(hostname, options, callback);
    });
  },
});

export const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  httpsAgent,
  headers: {
    Accept: 'application/json',
  },
});

tmdbApi.interceptors.request.use((config) => {
  if (process.env.TMDB_API_KEY) {
    config.headers.Authorization = `Bearer ${process.env.TMDB_API_KEY}`;
  }
  return config;
});
