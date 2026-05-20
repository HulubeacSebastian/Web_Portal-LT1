const path = require('path');
const { createRequire } = require('module');

const testsRoot = __dirname;
const monorepoRoot = path.resolve(testsRoot, '../..');
const frontendRoot = path.join(monorepoRoot, 'portal-lt1-frontend');
const requireFromFrontend = createRequire(path.join(frontendRoot, 'package.json'));

const react = requireFromFrontend('@vitejs/plugin-react');
const { defineConfig } = requireFromFrontend('vitest/config');

module.exports = defineConfig({
  plugins: [react()],
  root: frontendRoot,
  server: {
    fs: {
      allow: [monorepoRoot]
    }
  },
  resolve: {
    alias: {
      '@': path.join(frontendRoot, 'src'),
      '@testing-library/react': path.join(frontendRoot, 'node_modules/@testing-library/react'),
      '@testing-library/jest-dom': path.join(frontendRoot, 'node_modules/@testing-library/jest-dom'),
      '@testing-library/user-event': path.join(frontendRoot, 'node_modules/@testing-library/user-event'),
      'react-router-dom': path.join(frontendRoot, 'node_modules/react-router-dom'),
      react: path.join(frontendRoot, 'node_modules/react'),
      'react-dom': path.join(frontendRoot, 'node_modules/react-dom'),
      '@vitest/coverage-v8': path.join(frontendRoot, 'node_modules/@vitest/coverage-v8')
    }
  },
  test: {
    root: testsRoot,
    deps: {
      moduleDirectories: [path.join(frontendRoot, 'node_modules'), 'node_modules']
    },
    include: ['unit/**/*.{test,spec}.{js,jsx}'],
    exclude: ['**/node_modules/**', 'e2e/**'],
    environment: 'jsdom',
    setupFiles: [path.join(testsRoot, 'setup.js')],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        branches: 70,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
});
