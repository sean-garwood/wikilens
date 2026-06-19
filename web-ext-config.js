module.exports = {
  build: {
    artifactsDir: 'dist',
    ignoreFiles: [
      'test/**',
      'utils/**',
      '.claude/**',
      'scripts/**',
      'node_modules/**',
      'dist/**',
      '*.zip',
      '.prettierrc',
      'README.md',
      'Makefile',
      'CLAUDE.md',
      'build.config.json',
      'web-ext-config.js',
      'package.json',
      'package-lock.json',
    ],
  },
};
