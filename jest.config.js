/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        moduleResolution: 'node',
        paths: { '@/*': ['./*'] },
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'app/api/**/*.ts',
    'lib/**/*.ts',
    '!lib/generated/**',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
}

module.exports = config
