module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
      "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "/src/(.*|)\\.test\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
      "ts-jest": {
          "babelConfig": true,
          "diagnostics": false
      }
  },
  collectCoverage: true,
  collectCoverageFrom: [
      "src/**/*.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text-summary", "cobertura", "clover" ]
};
