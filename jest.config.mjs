import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Next.js アプリのパスを指定して next.config.mjs と .env を自動読み込み
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
