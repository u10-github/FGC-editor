/**
 * 格闘ゲームコマンドエディタ
 * アプリケーションDOM操作のユニットテスト
 */

import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

// テスト用のDOM環境をセットアップ
function setupDOM() {
  // テスト用のHTML構造を作成
  document.body.innerHTML = `
    <div class="command-display-container">
      <textarea id="command-input" class="command-input-field"></textarea>
      <button id="copy-button" class="action-button">
        <i class="material-icons">content_copy</i>
      </button>
    </div>
    
    <div class="button-grid">
      <button type="button" class="command-button" data-command="↖">↖</button>
      <button type="button" class="command-button" data-command="↑">↑</button>
      <button type="button" class="command-button" data-command="↗">↗</button>
      <button type="button" class="command-button" data-command="←">←</button>
      <button type="button" class="command-button" data-command="N">N</button>
      <button type="button" class="command-button" data-command="→">→</button>
      <button type="button" class="command-button" data-command="↙">↙</button>
      <button type="button" class="command-button" data-command="↓">↓</button>
      <button type="button" class="command-button" data-command="↘">↘</button>
    </div>
    
    <div class="action-buttons">
      <button type="button" id="convert-notation" class="conversion-button">矢印⇔数字変換</button>
      <button type="button" id="clear-input" class="secondary-button">クリア</button>
    </div>
    
    <div class="action-buttons">
      <button type="button" id="convert-to-arrows" class="conversion-button">数字→矢印変換</button>
      <button type="button" id="convert-to-numbers" class="conversion-button">矢印→数字変換</button>
    </div>
  `;

  // 通知表示関数のモック
  window.showNotification = jest.fn();

  // アプリケーションのメイン機能のシミュレート
  const setupApp = () => {
    // 要素の取得
    const commandInput = document.getElementById('command-input');
    const copyButton = document.getElementById('copy-button');
    const commandButtons = document.querySelectorAll('.command-button');
    const convertNotationButton = document.getElementById('convert-notation');
    const convertToArrowsButton = document.getElementById('convert-to-arrows');
    const convertToNumbersButton = document.getElementById('convert-to-numbers');
    const clearInputButton = document.getElementById('clear-input');
    
    // 矢印と数字の対応表
    const notationMap = {
      '↖': '7', '7': '↖',
      '↑': '8', '8': '↑',
      '↗': '9', '9': '↗',
      '←': '4', '4': '←',
      'N': '5', '5': 'N',
      '→': '6', '6': '→',
      '↙': '1', '1': '↙',
      '↓': '2', '2': '↓',
      '↘': '3', '3': '↘'
    };
    
    // データ状態
    let isArrowNotation = true;
    
    // カーソル位置に文字列を挿入する関数
    const insertAtCursor = (input, text) => {
      const currentValue = input.value;
      input.value = currentValue + text;
      return input.value;
    };
    
    // コマンドボタンのクリックイベント
    commandButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const command = this.getAttribute('data-command');
        insertAtCursor(commandInput, command);
      });
    });
    
    // 表記変換ボタンのクリックイベント（ボタン表示の切り替え）
    convertNotationButton.addEventListener('click', function() {
      isArrowNotation = !isArrowNotation;
      
      commandButtons.forEach(function(btn) {
        const currentNotation = btn.getAttribute('data-command');
        const newNotation = notationMap[currentNotation];
        
        if (newNotation) {
          btn.textContent = newNotation;
          btn.setAttribute('data-command', newNotation);
        }
      });
    });
    
    // 数字→矢印変換
    convertToArrowsButton.addEventListener('click', function() {
      let newText = '';
      let text = commandInput.value;
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[1-9]/.test(char)) {
          newText += notationMap[char] || char;
        } else {
          newText += char;
        }
      }
      
      // 特殊パターンの変換
      newText = newText.replace(/236/g, '↓↘→').replace(/214/g, '↓↙←');
      
      commandInput.value = newText;
    });
    
    // 矢印→数字変換
    convertToNumbersButton.addEventListener('click', function() {
      let newText = '';
      let text = commandInput.value;
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (['↖', '↑', '↗', '←', 'N', '→', '↙', '↓', '↘'].includes(char)) {
          newText += notationMap[char] || char;
        } else {
          newText += char;
        }
      }
      
      commandInput.value = newText;
    });
    
    // クリアボタンの処理
    clearInputButton.addEventListener('click', function() {
      commandInput.value = '';
      commandInput.focus();
    });

    // コピーボタンの処理
    copyButton.addEventListener('click', function() {
      commandInput.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    });
    
    return {
      commandInput,
      copyButton,
      commandButtons,
      convertNotationButton,
      convertToArrowsButton,
      convertToNumbersButton,
      clearInputButton,
      isArrowNotation
    };
  };

  return setupApp();
}

// テストスイート
describe('格闘ゲームコマンドエディタのDOM操作', () => {
  let app;
  
  beforeEach(() => {
    // 各テストの前にDOM環境を初期化
    app = setupDOM();
    document.execCommand = jest.fn().mockImplementation(() => true);
  });
  
  afterEach(() => {
    // テスト後にモックをリセット
    jest.resetAllMocks();
  });
  
  test('コマンドボタンのクリックで入力エリアにコマンドが追加される', () => {
    const commandButtons = document.querySelectorAll('.command-button');
    
    // 最初の矢印ボタン（↖）をクリック
    fireEvent.click(commandButtons[0]);
    expect(app.commandInput.value).toBe('↖');
    
    // 次に下向き矢印ボタン（↓）をクリック
    fireEvent.click(commandButtons[7]);
    expect(app.commandInput.value).toBe('↖↓');
    
    // 右下向き矢印ボタン（↘）をクリック
    fireEvent.click(commandButtons[8]);
    expect(app.commandInput.value).toBe('↖↓↘');
  });
  
  test('クリアボタンで入力エリアがクリアされる', () => {
    app.commandInput.value = '↓↘→P';
    
    fireEvent.click(app.clearInputButton);
    expect(app.commandInput.value).toBe('');
  });
  
  test('矢印⇔数字変換ボタンでボタン表示が切り替わる', () => {
    const firstButton = app.commandButtons[0];
    expect(firstButton.textContent).toBe('↖');
    expect(firstButton.getAttribute('data-command')).toBe('↖');
    
    // 変換ボタンをクリック
    fireEvent.click(app.convertNotationButton);
    
    // ボタンの表示が矢印から数字に変わる
    expect(firstButton.textContent).toBe('7');
    expect(firstButton.getAttribute('data-command')).toBe('7');
    
    // もう一度クリックすると元に戻る
    fireEvent.click(app.convertNotationButton);
    expect(firstButton.textContent).toBe('↖');
    expect(firstButton.getAttribute('data-command')).toBe('↖');
  });
  
  test('数字→矢印変換ボタンで入力内容が変換される', () => {
    app.commandInput.value = '236';
    
    fireEvent.click(app.convertToArrowsButton);
    expect(app.commandInput.value).toBe('↓↘→');
  });
  
  test('矢印→数字変換ボタンで入力内容が変換される', () => {
    app.commandInput.value = '↓↘→';
    
    fireEvent.click(app.convertToNumbersButton);
    expect(app.commandInput.value).toBe('236');
  });
  
  test('コピーボタンでクリップボードにコピーされる', () => {
    app.commandInput.value = '↓↘→P 波動拳';
    
    fireEvent.click(app.copyButton);
    
    // execCommandが呼ばれることを確認
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
}); 