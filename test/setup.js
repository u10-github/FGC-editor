// jestのDOMテスト拡張をインポート
import '@testing-library/jest-dom';

// グローバルな設定

// DOMクリップボードAPIのモック
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
  configurable: true,
});

// execCommandのモック
document.execCommand = jest.fn().mockImplementation(() => true);

// 通知メッセージ表示のテスト用ヘルパー
window.showNotification = jest.fn();

// コンソールログをモック化（テスト実行時に余計な出力を避けるため）
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}; 