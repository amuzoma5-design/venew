import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/volunteer",
        destination: "https://forms.gle/HiBj1BcgAFMx89q29",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;