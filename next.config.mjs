import { config } from "dotenv";
config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default nextConfig;
