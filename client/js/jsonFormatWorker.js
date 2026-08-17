/**
 * 在 Worker 中解析并美化 JSON，避免卡住页面主线程。
 * 主线程通过 postMessage 传入 { id, text }。
 */
const MAX_INPUT_CHARS = 2 * 1024 * 1024;
const MAX_OUTPUT_CHARS = 8 * 1024 * 1024;

self.onmessage = function (event) {
  const data = event.data || {};
  const id = data.id;
  const text = data.text;

  if (typeof text !== 'string') {
    self.postMessage({ id, ok: false, error: '输入不是字符串' });
    return;
  }

  if (text.length > MAX_INPUT_CHARS) {
    self.postMessage({
      id,
      ok: false,
      tooLarge: true,
      error: '字符串太大了，无法解析'
    });
    return;
  }

  const trimmed = text.trim();
  if (!trimmed) {
    self.postMessage({ id, ok: true, pretty: '' });
    return;
  }

  try {
    const parsed = JSON.parse(trimmed);
    const pretty = JSON.stringify(parsed, null, 2);
    if (pretty.length > MAX_OUTPUT_CHARS) {
      self.postMessage({
        id,
        ok: false,
        tooLarge: true,
        error: '字符串太大了，无法解析'
      });
      return;
    }
    self.postMessage({ id, ok: true, pretty });
  } catch (err) {
    self.postMessage({
      id,
      ok: false,
      error: err && err.message ? err.message : 'JSON 解析失败'
    });
  }
};
