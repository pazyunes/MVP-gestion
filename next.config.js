/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite cargar imágenes desde placeholders externos (fotos mock de profesionales).
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
};

module.exports = nextConfig;
