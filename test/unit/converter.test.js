/**
 * 格闘ゲームコマンドエディタ 
 * 変換機能のユニットテスト
 */

// テストユーティリティ
const createNotationConverter = () => {
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

  // 数字→矢印変換
  const convertToArrows = (text) => {
    let newText = '';
    // 数字を矢印に変換
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[1-9]/.test(char)) {
        newText += notationMap[char] || char;
      } else {
        newText += char;
      }
    }
    return newText;
  };

  // 矢印→数字変換
  const convertToNumbers = (text) => {
    let newText = '';
    // 矢印を数字に変換
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (['↖', '↑', '↗', '←', 'N', '→', '↙', '↓', '↘'].includes(char)) {
        newText += notationMap[char] || char;
      } else {
        newText += char;
      }
    }
    return newText;
  };

  // コマンドパターン変換
  const detectAndConvertPatterns = (text) => {
    let newText = text;
    
    // 236 -> ↓↘→
    newText = newText.replace(/236/g, '↓↘→');
    
    // 214 -> ↓↙←
    newText = newText.replace(/214/g, '↓↙←');
    
    // 623 -> →↓↘
    newText = newText.replace(/623/g, '→↓↘');
    
    // 421 -> ←↓↙
    newText = newText.replace(/421/g, '←↓↙');
    
    return newText;
  };

  return {
    convertToArrows,
    convertToNumbers,
    detectAndConvertPatterns,
    notationMap
  };
};

describe('コマンド表記変換機能', () => {
  let converter;

  beforeEach(() => {
    converter = createNotationConverter();
  });

  test('数字から矢印への変換', () => {
    expect(converter.convertToArrows('236')).toBe('↓↘→');
    expect(converter.convertToArrows('214')).toBe('↓↙←');
    expect(converter.convertToArrows('6321')).toBe('→↓↘↙');
    expect(converter.convertToArrows('5')).toBe('N');
    expect(converter.convertToArrows('AB123')).toBe('AB↙↓↘');
  });

  test('矢印から数字への変換', () => {
    expect(converter.convertToNumbers('↓↘→')).toBe('236');
    expect(converter.convertToNumbers('↓↙←')).toBe('214');
    expect(converter.convertToNumbers('→↓↘↙')).toBe('6321');
    expect(converter.convertToNumbers('N')).toBe('5');
    expect(converter.convertToNumbers('ABC↓↘→')).toBe('ABC236');
  });

  test('コマンドパターンの検出と変換', () => {
    expect(converter.detectAndConvertPatterns('236')).toBe('↓↘→');
    expect(converter.detectAndConvertPatterns('214')).toBe('↓↙←');
    expect(converter.detectAndConvertPatterns('623')).toBe('→↓↘');
    expect(converter.detectAndConvertPatterns('421')).toBe('←↓↙');
    expect(converter.detectAndConvertPatterns('攻撃236防御214')).toBe('攻撃↓↘→防御↓↙←');
  });

  test('普通のテキストは変換されないこと', () => {
    expect(converter.convertToArrows('Hello World')).toBe('Hello World');
    expect(converter.convertToNumbers('Hello World')).toBe('Hello World');
  });
}); 