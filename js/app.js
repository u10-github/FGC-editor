/**
 * 236↓↘→P - 格闘ゲームコマンドエディタ
 * メインJavaScriptファイル
 */

document.addEventListener('DOMContentLoaded', function() {
  // 要素の取得
  const commandInput = document.getElementById('command-input');
  const copyButton = document.getElementById('copy-button');
  const commandButtons = document.querySelectorAll('.command-button');
  const attackButtons = document.querySelectorAll('.attack-button');
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
  
  // 通知を表示する関数
  function showNotification(message, duration = 2000) {
    // 既存の通知があれば削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // 新しい通知を作成
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 表示アニメーション
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // 指定時間後に非表示
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
  }
  
  // カーソル位置に文字列を挿入する関数
  function insertAtCursor(input, text) {
    // テキストエリアの場合
    if (input.tagName.toLowerCase() === 'textarea') {
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;
      const scrollTop = input.scrollTop;
      const currentValue = input.value;
      
      input.value = currentValue.substring(0, startPos) + text + currentValue.substring(endPos, currentValue.length);
      input.focus();
      input.selectionStart = startPos + text.length;
      input.selectionEnd = startPos + text.length;
      input.scrollTop = scrollTop;
    } 
    // 他の入力要素の場合
    else if (input.tagName.toLowerCase() === 'input') {
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;
      const currentValue = input.value;
      
      input.value = currentValue.substring(0, startPos) + text + currentValue.substring(endPos, currentValue.length);
      input.focus();
      input.selectionStart = startPos + text.length;
      input.selectionEnd = startPos + text.length;
    }
  }
  
  // コマンドボタンのクリックイベント
  commandButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const command = this.getAttribute('data-command');
      insertAtCursor(commandInput, command);
    });
  });
  
  // 攻撃ボタンのクリックイベント
  attackButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const command = this.getAttribute('data-command');
      insertAtCursor(commandInput, command);
    });
  });
  
  // 表記変換ボタンのクリックイベント（ボタン表示の切り替え）
  convertNotationButton.addEventListener('click', function() {
    // ボタン表示の切り替え
    isArrowNotation = !isArrowNotation;
    
    // ボタンの表示を更新
    commandButtons.forEach(function(btn) {
      const currentNotation = btn.getAttribute('data-command');
      const newNotation = notationMap[currentNotation];
      
      if (newNotation) {
        btn.textContent = newNotation;
        btn.setAttribute('data-command', newNotation);
      }
    });
    
    showNotification(`ボタン表記を${isArrowNotation ? '矢印' : '数字'}に変更しました`);
  });
  
  // 数字→矢印変換
  convertToArrowsButton.addEventListener('click', function() {
    let newText = '';
    let text = commandInput.value;
    
    // 数字を矢印に変換
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[1-9]/.test(char)) {
        newText += notationMap[char] || char;
      } else {
        newText += char;
      }
    }
    
    // 特殊パターンの変換（例: 236P → ↓↘→P）
    newText = newText.replace(/↓↘→/g, '↓↘→').replace(/↓↙←/g, '↓↙←');
    
    commandInput.value = newText;
    showNotification('数字表記を矢印表記に変換しました');
  });
  
  // 矢印→数字変換
  convertToNumbersButton.addEventListener('click', function() {
    let newText = '';
    let text = commandInput.value;
    
    // 矢印を数字に変換
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (['↖', '↑', '↗', '←', 'N', '→', '↙', '↓', '↘'].includes(char)) {
        newText += notationMap[char] || char;
      } else {
        newText += char;
      }
    }
    
    commandInput.value = newText;
    showNotification('矢印表記を数字表記に変換しました');
  });
  
  // テキスト入力のイベント処理
  commandInput.addEventListener('input', function() {
    // 入力内容の処理（必要に応じて）
  });
  
  // クリアボタンの処理
  clearInputButton.addEventListener('click', function() {
    commandInput.value = '';
    commandInput.focus();
    showNotification('入力をクリアしました');
  });

  // コピーボタンの処理
  copyButton.addEventListener('click', function() {
    // テキストエリアの内容を選択
    commandInput.select();
    
    try {
      // クリップボードにコピー
      const successful = document.execCommand('copy');
      
      if (successful) {
        showNotification('コマンドをクリップボードにコピーしました');
      } else {
        // execCommandが失敗した場合のフォールバック（モダンブラウザ用）
        navigator.clipboard.writeText(commandInput.value)
          .then(() => {
            showNotification('コマンドをクリップボードにコピーしました');
          })
          .catch(err => {
            showNotification('コピーに失敗しました: ' + err);
          });
      }
    } catch (err) {
      // execCommandがサポートされていない場合のフォールバック
      navigator.clipboard.writeText(commandInput.value)
        .then(() => {
          showNotification('コマンドをクリップボードにコピーしました');
        })
        .catch(err => {
          showNotification('コピーに失敗しました: ' + err);
        });
    }
    
    // 選択解除
    window.getSelection().removeAllRanges();
  });
  
  // 数字コマンドパターンを検出して変換する高度な変換
  function detectAndConvertPatterns() {
    const text = commandInput.value;
    
    // よく使われるコマンドパターンの変換
    // 例: 236P → ↓↘→P, 623K → →↓↘K など
    let newText = text;
    
    // 236 -> ↓↘→
    newText = newText.replace(/236/g, '↓↘→');
    
    // 214 -> ↓↙←
    newText = newText.replace(/214/g, '↓↙←');
    
    // 623 -> →↓↘
    newText = newText.replace(/623/g, '→↓↘');
    
    // 421 -> ←↓↙
    newText = newText.replace(/421/g, '←↓↙');
    
    // 632146 -> →↓↘↓↙←
    newText = newText.replace(/632146/g, '→↓↘↓↙←');
    
    // 412364 -> ←↓↙↓↘→
    newText = newText.replace(/412364/g, '←↓↙↓↘→');
    
    // 63214789 -> →↓↘↓↙←↖↑↗
    newText = newText.replace(/63214789/g, '→↓↘↓↙←↖↑↗');
    
    if (newText !== text) {
      commandInput.value = newText;
      showNotification('コマンドパターンを変換しました');
    }
  }
  
  // パターン検出ボタンとして数字→矢印変換ボタンにも割り当て
  convertToArrowsButton.addEventListener('click', detectAndConvertPatterns);
  
  // 初期フォーカス
  commandInput.focus();
}); 