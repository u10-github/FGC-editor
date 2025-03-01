module.exports = {
  // テスト環境をブラウザライクなDOM環境に設定
  testEnvironment: 'jsdom',
  
  // カバレッジレポートの設定
  collectCoverageFrom: [
    'src/js/**/*.js',
    '!**/node_modules/**',
  ],
  
  // セットアップファイル
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  
  // モジュールのモック設定
  moduleNameMapper: {
    // CSSファイルのモック
    '\\.(css|less|scss|sass)$': '<rootDir>/test/mocks/styleMock.js',
    
    // 画像ファイルのモック
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/test/mocks/fileMock.js',
  },
  
  // テストマッチャー
  testMatch: [
    '<rootDir>/test/**/*.test.js',
    '<rootDir>/test/**/*.spec.js',
  ],
}; 